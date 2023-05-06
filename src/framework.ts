export type Subscriber<T> = (data: T) => void;

export class Model<T> {
  private _data: T;
  private _subscribers: Array<Subscriber<T>> = [];

  constructor(data: T) {
    this._data = data;
  }

  get data(): T {
    return this._data;
  }

  set data(data: T) {
    this._data = data;
    this.notify();
  }

  subscribe(subscriber: Subscriber<T>): void {
    this._subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    const index = this._subscribers.indexOf(subscriber);
    if (index !== -1) {
      this._subscribers.splice(index, 1);
    }
  }

  notify(): void {
    for (const subscriber of this._subscribers) {
      subscriber(this._data);
    }
  }
}

export class Presenter<T> {
  private _model: Model<T>;
  private _view: View<T>;

  constructor(
    model: Model<T>,
    template: (data: T) => string,
    root: HTMLElement
  ) {
    this._model = model;
    this._view = new View<T>(root, template, this);
  }

  get data(): T {
    return this._model.data;
  }

  set data(data: T) {
    this._model.data = data;
    this._view.render();
  }

  destroy(): void {
    this._model.destroy();
    this._view.destroy();
  }
}

export class View<T> {
  private _root: HTMLElement;
  private _template: (data: T) => string;
  private _presenter: Presenter<T>;

  constructor(
    root: HTMLElement,
    template: (data: T) => string,
    presenter: Presenter<T>
  ) {
    this._root = root;
    this._template = template;
    this._presenter = presenter;
  }

  render(): void {
    const data = this._presenter.data;
    const html = this._template(data);
    this._root.innerHTML = html;
  }

  destroy(): void {
    this._presenter.destroy();
  }
}
