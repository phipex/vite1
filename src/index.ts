import { resolve } from "path";
import { Component, Model, Presenter, View } from "./framework";
import "./style.css";
import { sum } from "./sum";
import { config } from "process";

export { sum } from "./sum";

console.log(sum(1, 2));

export interface Request {
  gpUser: string;
  system: string;
  msgName: string;
  sysOperator: string;
  player: string;
  token: string;
  game: string;
  msgDescrip: MsgDescrip;
}

export interface MsgDescrip {}

export interface Config {
  maxBet: string;
  minBet: string;
  maxPrizeMult: string;
  deno: number[];
  doubleUpEnable: boolean;
}

export interface Prizes {
  betTypes: BetType[];
}

export interface BetType {
  id: number;
  name: string;
  score: number;
  topBet: any;
  betTypes: any;
}

export interface Balance {
  balance: number;
  bonusNonRestricted: number;
  bonusRestricted: number;
}

export interface PlaySession {
  cards: number[];
  idPlaysession: number;
  gain: number;
}

export interface Bet {
  amount: number;
  currency: string;
  deno: number;
}

class Card {
  id!: number;
  num!: number;
}

class Hand {
  cards: Card[] = [];
}

class PokerGame {
  actualHand?: Hand | number[];
  actualBet?: Bet;
  actualPlaysession?: PlaySession;
  actualBalance?: Balance;
  actualConfig?: Config;
  actualPrizes?: Prizes;
}

class PokerServiceMock {
  bet(bet: Bet): Promise<PlaySession> {
    return new Promise<PlaySession>(resolve => {
      setTimeout(() => {
        resolve({
          cards: [27, 29, 43, 15, 9],
          idPlaysession: 199401,
          gain: 0,
        });
      }, this.getTimeout());
    });
  }

  loadBalance(): Promise<Balance> {
    return new Promise<Balance>(resolve => {
      setTimeout(() => {
        resolve({
          balance: 998200,
          bonusNonRestricted: 0,
          bonusRestricted: 0,
        });
      }, this.getTimeout());
    });
  }

  loadConfig(): Promise<Config> {
    return new Promise<Config>(resolve => {
      setTimeout(() => {
        resolve({
          maxBet: "10",
          minBet: "1",
          maxPrizeMult: "2",
          deno: [100, 2000],
          doubleUpEnable: true,
        });
      }, this.getTimeout());
    });
  }

  loadPrizes(): Promise<Prizes> {
    return new Promise<Prizes>(resolve => {
      setTimeout(() => {
        resolve({
          betTypes: [
            {
              id: 1,
              name: "JOTAS O MEJOR",
              score: 1,
              topBet: null,
              betTypes: null,
            },
            {
              id: 2,
              name: "DOBLE PAR",
              score: 2,
              topBet: null,
              betTypes: null,
            },
            {
              id: 3,
              name: "TERNA",
              score: 3,
              topBet: null,
              betTypes: null,
            },
            {
              id: 4,
              name: "ESCALERA",
              score: 4,
              topBet: null,
              betTypes: null,
            },
            {
              id: 5,
              name: "COLOR",
              score: 5,
              topBet: null,
              betTypes: null,
            },
            {
              id: 6,
              name: "FULL(TRIO + PAR)",
              score: 6,
              topBet: null,
              betTypes: null,
            },
            {
              id: 7,
              name: "POKER",
              score: 25,
              topBet: null,
              betTypes: null,
            },
            {
              id: 8,
              name: "ESCALERA COLOR",
              score: 50,
              topBet: null,
              betTypes: null,
            },
            {
              id: 9,
              name: "ESCALERA REAL",
              score: 400,
              topBet: null,
              betTypes: null,
            },
          ],
        });
      }, this.getTimeout());
    });
  }

  getTimeout(): number {
    return Math.random() * 2000;
  }
}

class PokerModel extends Model<PokerGame> {
  service: PokerServiceMock;

  constructor(game: PokerGame) {
    super(game);
    this.service = new PokerServiceMock();
  }

  loadConfig(): Promise<void> {
    return new Promise<void>(resolve => {
      console.log("cargando configuracion");
      this.service.loadConfig().then(config => {
        this.getState().actualConfig = config;
        this.update();
        resolve();
      });
    });
  }

  loadPrize(): Promise<void> {
    return new Promise<void>(resolve => {
      console.log("cargando prizes");
      this.service.loadPrizes().then(prizes => {
        this.getState().actualPrizes = prizes;
        this.update();
        resolve();
      });
    });
  }

  loadBalance(): Promise<void> {
    return new Promise<void>(resolve => {
      console.log("cargando balance");
      this.service.loadBalance().then(balance => {
        this.getState().actualBalance = balance;
        this.update();
        resolve();
      });
    });
  }

  betRequest(bet: Bet): Promise<PlaySession> {
    this.getState().actualBet = bet;
    return new Promise<PlaySession>(resolve => {
      console.log("realizando apuesta");
      this.service.bet(bet).then(playsesion => {
        this.getState().actualPlaysession = playsesion;
        this.getState().actualHand = playsesion.cards;
        this.update();
        resolve(playsesion);
      });
    });
  }
}

class PokerView implements View<PokerGame> {
  model: PokerModel;

  constructor(model: PokerModel) {
    this.model = model;
  }

  betCallback?: (bet: Bet) => void;

  render(): void {
    console.log("render model");
  }
  showLoadMsg(msg = ""): void {
    console.log(msg, "cargando ....");
  }
  hideLoadMsg(msg = "") {
    console.log(msg, "finalizo la descarga");
  }
  showErrorMsg(e: unknown) {
    console.log("error em la descarga");
  }
  subscribeBetCallback(call: (bet: Bet) => void) {
    this.betCallback = call;
  }
  bet() {
    console.log("bet");
    if (this.betCallback) {
      console.log("bet");
      this.showLoadMsg("bet");
      this.betCallback(this.getBetParameters());
      this.hideLoadMsg("bet");
    } else {
      console.error("no se registro el callback");
      this.showErrorMsg("no se registro el callback");
    }
  }

  private getBetParameters(): Bet {
    //TODO leer de la interfaz
    return {
      amount: 1,
      currency: "COP",
      deno: 100,
    };
  }
  getModel(): Model<PokerGame> {
    return this.model;
  }
}

class PokerPresenter extends Presenter<PokerGame> {
  constructor(view: PokerView, model: PokerModel) {
    super(view, model);

    view.subscribeBetCallback(this.betCallback);
    //this.initGame().catch(console.error);
  }
  async betCallback(bet: Bet): Promise<void> {
    const model = this.getModel() as PokerModel;

    try {
      model.betRequest(bet).catch(console.error);
    } catch (e) {
      console.error("", e);
    }
  }

  async initGame() {
    const model = this.getModel() as PokerModel;
    const view = this.getView() as PokerView;
    try {
      view.showLoadMsg();
      await model.loadConfig();
      await model.loadPrize();
      await model.loadBalance();
      view.hideLoadMsg();
    } catch (e) {
      view.showErrorMsg(e);
    }
  }
}

const pokerGame = new PokerGame();
const model = new PokerModel(pokerGame);
const view = new PokerView(model);
const presenter = new PokerPresenter(view, model);

presenter.initGame().then(() => view.bet());
