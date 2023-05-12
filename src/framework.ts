// Clase Observable para implementar el enfoque reactivo
export type SimpleValue = string | number | number[] | object | undefined;

export class SimpleObject {
  [prop: string]: SimpleValue;
}

export class ObservableChange<T extends SimpleObject> {
  propierty: keyof T;
  newValue: SimpleValue;
  oldValue: SimpleValue;

  constructor(
    propierty: keyof T,
    newValue: SimpleValue,
    oldValue: SimpleValue
  ) {
    this.propierty = propierty;
    this.newValue = newValue;
    this.oldValue = oldValue;
  }
}

export class Observable<T extends SimpleObject> {
  obj: T;
  private observers: Array<(value: ObservableChange<T>) => void> = [];

  constructor(original: T) {
    const that = this;
    this.obj = new Proxy(original, {
      set(target, name: string, value, receiver) {
        const nama = name as keyof T;
        console.log("set " + name + " to " + value, "oldValue " + target[nama]);
        const change = new ObservableChange<T>(nama, value, target[nama]);
        that.notify(change);
        target[nama] = value;
        return true;
      },
    });
  }

  subscribe(observer: (value: ObservableChange<T>) => void): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: (value: ObservableChange<T>) => void): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(value: ObservableChange<T>): void {
    this.observers.forEach(obs => obs(value));
  }

  get(): T {
    return this.obj;
  }
}

// Definición de la interfaz de la vista
export interface View<T extends SimpleObject> {
  render(changhe: ObservableChange<T>): void;
}

// Clase Model que se encarga de manejar el estado de la aplicación
export class Model<T extends SimpleObject> {
  private state: T;

  private state$: Observable<T>;

  constructor(initialState: T) {
    this.state = initialState;
    this.state$ = new Observable<T>(initialState);
  }

  getState(): T {
    return this.state$.get();
  }

  getState$(): Observable<T> {
    return this.state$;
  }
}

// Clase Presenter que se encarga de manejar la lógica de la aplicación
export class Presenter<T extends SimpleObject> {
  private view: View<T>;

  private model: Model<T>;

  constructor(view: View<T>, model: Model<T>) {
    this.view = view;
    this.model = model;

    // Suscribirse al Observable del modelo para actualizar la vista en caso de cambio
    this.model.getState$().subscribe((data: ObservableChange<T>) => {
      this.view.render(data);
    });
  }

  getView(): View<T> {
    return this.view;
  }

  getModel(): Model<T> {
    return this.model;
  }
}

// Clase Component que define la base de cualquier componente que desee utilizar el framework
export abstract class Component<T extends SimpleObject> {
  private presenter: Presenter<T>;

  constructor(view: View<T>, model: Model<T>) {
    this.presenter = new Presenter(view, model);
  }

  protected getView(): View<T> {
    return this.presenter.getView();
  }

  protected getModel(): Model<T> {
    return this.presenter.getModel();
  }

  abstract render(): void;
}
