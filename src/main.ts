import Aurelia, { RouterConfiguration } from 'aurelia';
import { MyApp } from './my-app';

//temporary work-around for HMR
document.querySelector('my-app').innerHTML = '';

Aurelia
  .register(RouterConfiguration)
  .app(MyApp)
  .start();
