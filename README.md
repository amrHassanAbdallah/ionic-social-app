## Brief:
Ionice based mobile app, have main features such as posts, like posts, added and search, follow friends.



### Up & Running
You will need to install [ionic](https://ionicframework.com/docs/v3/intro/installation/), [npm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04)
Create a Realtime db over fire base, make sure to update the rules to the below
```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
clone this repo: `git clone https://github.com/amrHassanAbdallah/ionic-social-app.git`

Then you will need to update `src/app/app.firebaseconfig.ts`
```

export var config = {
    apiKey: <apiKey>,
    authDomain: <yourauthDomain>,
    databaseURL: <yourdatabaseURL>,
    projectId: <yourprojectId>,
    storageBucket: <yourstoragebucket>,
    messagingSenderId: <yoursenderIdhere>
  };

```
Replace the <> values with your actual values from firebase.
Then ,
1. `npm install`
1. run `ionic serve` from a terminal

