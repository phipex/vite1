// Definición de la interfaz de la vista
export interface View {
  render(): void;
}

// Clase Observable para implementar el enfoque reactivo
export class Observable<T> {
  private observers: Array<(value: T) => void> = [];

  subscribe(observer: (value: T) => void): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: (value: T) => void): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(value: T): void {
    this.observers.forEach(obs => obs(value));
  }
}

// Clase Model que se encarga de manejar el estado de la aplicación
export class Model<T> {
  private state: T;

  private state$ = new Observable<T>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T): void {
    this.state = newState;
    this.state$.notify(this.state);
  }

  getState$(): Observable<T> {
    return this.state$;
  }

  update(): void {
    this.state$.notify(this.state);
  }
}

// Clase Presenter que se encarga de manejar la lógica de la aplicación
export class Presenter<T> {
  private view: View;

  private model: Model<T>;

  constructor(view: View, model: Model<T>) {
    this.view = view;
    this.model = model;

    // Suscribirse al Observable del modelo para actualizar la vista en caso de cambio
    this.model.getState$().subscribe((data: T) => {
      console.log("data change", data);
      this.view.render();
    });
  }

  getView(): View {
    return this.view;
  }

  getModel(): Model<T> {
    return this.model;
  }
}

// Clase Component que define la base de cualquier componente que desee utilizar el framework
export abstract class Component<T> {
  private presenter: Presenter<T>;

  constructor(view: View, model: Model<T>) {
    this.presenter = new Presenter(view, model);
  }

  protected getView(): View {
    return this.presenter.getView();
  }

  protected getModel(): Model<T> {
    return this.presenter.getModel();
  }

  abstract render(): void;
}
