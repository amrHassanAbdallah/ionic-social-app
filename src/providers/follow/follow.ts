import {Injectable} from '@angular/core';
import firebase from "firebase";
import {Events} from "ionic-angular";

/*
  Generated class for the FollowProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FollowProvider {
  firedata = firebase.database().ref('/chatusers');

  constructor(public events: Events) {
    console.log('Hello FollowProvider Provider');
  }

  //method to get the followers

  //method to get the  users I follow
  updateFollowers(followeeKey) {
    return new Promise((resolve, reject) => {
      this.firedata.child(followeeKey).child('/followers').push({user_id: firebase.auth().currentUser.uid}).then(() => {
        resolve({success: true});
      })
    });
  }

  // Follow a person
  //should  add record in the follow for the current signed in user
  follow(followeeKey) {
    return new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).child('/follow').push({user_id: followeeKey}).then(async () => {
        //and a record for the one he follows under the
        await this.updateFollowers(followeeKey);
        resolve({success: true});
      })
    });
  }


  unfollow(followeeKey) {
    return new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).child('/follow').push({user_id: followeeKey}).then(async () => {
        //and a record for the one he follows under the
        await this.updateFollowers(followeeKey);
        resolve({success: true});
      })
    });
  }
}
