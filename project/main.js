import {CGFapplication} from '../lib/CGF.js';
import { MyInterface } from './MyInterface.js';
import { MyScene } from './MyScene.js';
//import {MyInterface} from './MyInterface.js';
import { MyUI } from './MyUI.js';

function main()
{
    var app = new CGFapplication(document.body);
    var myScene = new MyScene();
    //var myInterface = new MyInterface();
    var myInterface = new MyUI();

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	app.run();
}

main();