# AdminLTE

![Preview](https://almsaeedstudio.com/img/AdminLTE2.1.png)



## Lauching with node > 7 locally installed

```
npm install
npm start
```

## Developement

bootstrap : main component i.e AppComponent
declarations : Others Component including AppComponent
imports : Module and Routing
providers : Service



Adding a component

```
cd src/app/widgets/
npm run gen component my-new-widget
```

Add page

```
cd src/app/pages/
npm run gen component my-new-page
```

Add a service

```
cd src/app/services/
npm run gen service my-new-service
```

## Components from Ng2-bootstrap

For standard boostrap widget we are using ng2-bootstrap

You can find all widget and the doc here:
http://valor-software.com/ng2-bootstrap/#/alerts

## Specific Components

### App Header

This widget handle the header bar, it includes other 'box' widgets for the top navigation:

* Messages Box
* Notification Box
* Tasks Box
* User box

### Messages Box

This widget is registred to the messages service

### Notification Box

WIP This widget is registred to the notification service

### Tasks Box

WIP This widget is registred to the task service

### User box

This widget is registred to the user service (for the current user display)

### Menu Aside

This widget handle the left navigation Menu

It is registred to the user service (for the current user display)

## Models

### User

* *firstname*: string, First Name of the user
* *lastname* : string, Last Name of the user
* *email* : string, Email address of the user
* *avatar_url* : string, URL for the user avatar, could be absolute or relative
* *creation_date* : string, timestamp of the creation of the user

### Message

* *title* : string, title of the message
* *content* : string, content of the mesage
* *author* : User, source user of the message
* *destination* : User, destination user of the message
* *date* : string, date of sending

## Services

### User service

This service is used to send/get the current user informations accross the app

For example you can set the current user :

```
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
...
constructor(
  private _user_serv: UserService
){
...
ngOnInit(){
  let user = new User({
    firstname: "Nilesh",
    lastname: "Yadav",
    email: "nileshyadav326@gmail.com",
    avatar_url: "https://scontent.fbom3-1.fna.fbcdn.net/v/t1.0-1/p160x160/18093_871106686283121_7448320562918053215_n.jpg?_nc_cat=0&oh=48c285be5faff53048e7ebc687d8c26e&oe=5B6E9486"
  });
  this._user_serv.setCurrentUser( user );
```

and you can get the user in a widget:

```
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
...
private current_user: User;
constructor(
  private _user_serv : UserService,
){
  //Connect to the current user modification
  this._user_serv.current_user.subscribe((user: User) => this.current_user = user);
```

warning, the import path are relative to the component you're writing in ...


To run your builds, you now need to do the following commands:
   - "npm run build" to build.
   - "npm run test" to run unit tests.
   - "npm start" to serve the app using webpack-dev-server.
   - "npm run e2e" to run protractor.

Remember while dep

WEB-INI Folder backup from shiva/dipankar