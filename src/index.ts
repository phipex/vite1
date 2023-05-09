import { Component, Model } from "./framework";
import "./style.css";
import { sum } from "./sum";

export { sum } from "./sum";

console.log(sum(1, 2));

// Ejemplo de implementación del framework en un componente de contador
class CounterComponent extends Component<number> {
  constructor() {
    // Crear la vista
    const view = {
      render: () => {
        const value = this.getModel().getState();
        console.log(`El contador tiene un valor de ${value}`);
      },
    };

    // Crear el modelo
    const model = new Model<number>(0);

    super(view, model);
  }

  // Método para incrementar el contador
  increment(): void {
    const currentValue = this.getModel().getState();
    this.getModel().setState(currentValue + 1);
  }

  // Método para decrementar el contador
  decrement(): void {
    const currentValue = this.getModel().getState();
    this.getModel().setState(currentValue - 1);
  }

  // Método para renderizar el componente
  render(): void {
    this.getView().render();
  }
}

// Crear una instancia del componente de contador
const counter = new CounterComponent();

// Incrementar el contador dos veces
counter.increment();
counter.increment();

// Decrementar el contador una vez
counter.decrement();

// Renderizar el componente para actualizar la vista
counter.render();
