import createReconciler, { type ReactContext } from 'react-reconciler';
import {
  DefaultEventPriority,
  NoEventPriority,
} from 'react-reconciler/constants.js';
import type * as React from 'react';
import { createContext } from 'react';

// 定义类型
type ElementNames = string;
type Props = Record<string, unknown>;
type HostContext = {
  isInsideText: boolean;
};

// 文本节点类
export class TextNode {
  public text: string;
  public parent?: MarkdownNode;

  constructor(text: string) {
    this.text = text;
  }

  setText(text: string): void {
    this.text = text;
  }
}

// Markdown 节点类
export class MarkdownNode {
  public type: string;
  public props: Record<string, unknown>;
  public children: (MarkdownNode | TextNode)[];
  public parent?: MarkdownNode;

  constructor(type: string, props: Record<string, unknown> = {}) {
    this.type = type;
    this.props = props;
    this.children = [];
  }

  appendChild(child: MarkdownNode | TextNode): void {
    console.log('MarkdownNode.appendChild called:', { 
      parentType: this.type, 
      childType: child instanceof TextNode ? `TextNode("${child.text}")` : `MarkdownNode(${child.type})`,
      childrenBefore: this.children.length
    });
    
    this.children.push(child);
    if ('parent' in child) {
      child.parent = this;
    }
    
    console.log('MarkdownNode.appendChild completed:', { 
      childrenAfter: this.children.length 
    });
  }

  removeChild(child: MarkdownNode | TextNode): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  insertBefore(child: MarkdownNode | TextNode, beforeChild: MarkdownNode | TextNode): void {
    const index = this.children.indexOf(beforeChild);
    if (index !== -1) {
      this.children.splice(index, 0, child);
    } else {
      this.appendChild(child);
    }
    if ('parent' in child) {
      child.parent = this;
    }
  }

 
}

// 当前更新优先级
let currentUpdatePriority = NoEventPriority;
// 保存最后渲染的结果
export let lastRootNode: MarkdownNode | null = null;
// 渲染完成标志
export let _renderCompleted = false;

// 创建 React Reconciler 配置
const hostConfig = {
  // 基础配置
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: false,

  // 获取根容器上下文
  getRootHostContext(): HostContext {
    return { isInsideText: false };
  },

  // 获取子元素上下文
  getChildHostContext(parentHostContext: HostContext, type: string): HostContext {
    const previousIsInsideText = parentHostContext.isInsideText;
    // 检查是否应该作为文本处理
    const isInsideText = type === 'text' || type === 'span' || previousIsInsideText;

    console.log('getChildHostContext:', { type, previousIsInsideText, isInsideText });

    if (previousIsInsideText === isInsideText) {
      return parentHostContext;
    }

    return { isInsideText };
  },

  // 创建实例
  createInstance(type: string, props: Props): MarkdownNode {
    console.log('createInstance:', { type, props });
    return new MarkdownNode(type, props);
  },

  // 创建文本实例
  createTextInstance(text: string): TextNode {
    console.log('createTextInstance:', { text });
    return new TextNode(text);
  },

  // 检查是否应该设置文本内容
  shouldSetTextContent(type: string, props: Props): boolean {
    console.log('shouldSetTextContent:', { type, props });
    // 对于简单的文本内容，我们返回 false 让 React 创建文本节点
    return false;
  },

  // 添加子元素
  appendChild(parent: MarkdownNode, child: MarkdownNode | TextNode): void {
    console.log('appendChild:', { parent: parent.type, child: child instanceof TextNode ? `TextNode("${child.text}")` : `MarkdownNode(${child.type})` });
    parent.appendChild(child);
  },

  // 插入子元素
  insertBefore(parent: MarkdownNode, child: MarkdownNode | TextNode, beforeChild: MarkdownNode | TextNode): void {
    console.log('insertBefore:', { parent: parent.type, child, beforeChild });
    parent.insertBefore(child, beforeChild);
  },

  // 移除子元素
  removeChild(parent: MarkdownNode, child: MarkdownNode | TextNode): void {
    parent.removeChild(child);
  },

  // 更新文本内容
  commitTextUpdate(textInstance: TextNode, _oldText: string, newText: string): void {
    textInstance.setText(newText);
  },

  // 准备更新
  prepareUpdate(): Record<string, never> {
    return {};
  },

  // 提交更新
  commitUpdate(
    _instance: MarkdownNode,
    _type: string,
    _oldProps: Props,
    _newProps: Props,
    _internalHandle: unknown
  ): void {
    // 在这个简单实现中，我们不需要特殊的更新逻辑
  },

  // 完成初始化
  finalizeInitialChildren(): boolean {
    return false;
  },

  // 清空容器
  clearContainer(container: MarkdownNode): void {
    container.children = [];
  },

  // 处理更新优先级
  setCurrentUpdatePriority(newPriority: number): void {
    currentUpdatePriority = newPriority;
  },

  getCurrentUpdatePriority(): number {
    return currentUpdatePriority;
  },

  resolveUpdatePriority(): number {
    if (currentUpdatePriority !== NoEventPriority) {
      return currentUpdatePriority;
    }
    return DefaultEventPriority;
  },

  // 添加缺失的方法
  appendInitialChild(parent: MarkdownNode, child: MarkdownNode | TextNode): void {
    console.log('appendInitialChild:', { parent: parent.type, child: child instanceof TextNode ? `TextNode("${child.text}")` : `MarkdownNode(${child.type})` });
    parent.appendChild(child);
  },

  preparePortalMount(): void {
    // Portal 挂载准备逻辑
  },

  // 其他必需的实现
  resetTextContent(): void {},
  getPublicInstance(instance: MarkdownNode | TextNode) {
    return instance;
  },
  prepareForCommit(_containerInfo: MarkdownNode): null {
    console.log('prepareForCommit called');
    return null;
  },
  resetAfterCommit(containerInfo: MarkdownNode): void {
    console.log('resetAfterCommit called, containerInfo:', containerInfo);
    console.log('resetAfterCommit containerInfo.children:', containerInfo.children);
    lastRootNode = containerInfo;
    _renderCompleted = true;
  },
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  getCurrentEventPriority(): number {
    return DefaultEventPriority;
  },
  getInstanceFromNode(): null {
    return null;
  },
  beforeActiveInstanceBlur(): void {},
  afterActiveInstanceBlur(): void {},
  prepareScopeUpdate(): void {},
  getInstanceFromScope(): null {
    return null;
  },
  detachDeletedInstance(): void {},

  // 容器相关方法
  appendChildToContainer(container: MarkdownNode, child: MarkdownNode | TextNode): void {
    console.log('appendChildToContainer:', { container: container.type, child: child instanceof TextNode ? `TextNode("${child.text}")` : `MarkdownNode(${child.type})` });
    container.appendChild(child);
  },

  insertInContainerBefore(container: MarkdownNode, child: MarkdownNode | TextNode, beforeChild: MarkdownNode | TextNode): void {
    console.log('insertInContainerBefore:', { container: container.type, child, beforeChild });
    container.insertBefore(child, beforeChild);
  },

  removeChildFromContainer(container: MarkdownNode, child: MarkdownNode | TextNode): void {
    console.log('removeChildFromContainer:', { container: container.type, child });
    container.removeChild(child);
  },

  hideInstance(_instance: MarkdownNode): void {
    // 隐藏实例的逻辑，这里我们可以设置一个标记
  },

  hideTextInstance(textInstance: TextNode): void {
    textInstance.setText('');
  },

  unhideInstance(_instance: MarkdownNode): void {
    // 显示实例的逻辑
  },

  unhideTextInstance(textInstance: TextNode, text: string): void {
    textInstance.setText(text);
  },

  // React 18+ 新增方法
  maySuspendCommit(): boolean {
    return false;
  },

  preloadInstance(): boolean {
    return true;
  },

  startSuspendingCommit(): void {},

  suspendInstance(): void {},

  waitForCommitToBeReady(): null {
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/naming-convention
  NotPendingTransition: null as unknown,

  // eslint-disable-next-line @typescript-eslint/naming-convention
  HostTransitionContext: createContext(null) as unknown as ReactContext<unknown>,

  resetFormInstance(): void {},

  requestPostPaintCallback(): void {},

  shouldAttemptEagerTransition(): boolean {
    return false;
  },

  trackSchedulerEvent(): void {},

  resolveEventType(): null {
    return null;
  },

  resolveEventTimeStamp(): number {
    return -1.1;
  },
};

// 创建 reconciler 实例
export const reconciler = createReconciler<
  ElementNames,
  Props,
  MarkdownNode,
  MarkdownNode,
  TextNode,
  MarkdownNode,
  unknown,
  unknown,
  unknown,
  HostContext,
  unknown,
  unknown,
  unknown,
  unknown
>(hostConfig);


