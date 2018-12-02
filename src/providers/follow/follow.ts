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
  peopleIFollow;
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
      console.log(followeeKey);
      this.firedata.child(firebase.auth().currentUser.uid).child('/follow').orderByChild('user_id').equalTo(followeeKey).once('value', (snapshot) => {
        let somekey;
        for (var key in snapshot.val())
          somekey = key;
        console.log(somekey, snapshot.val());
        this.firedata.child(firebase.auth().currentUser.uid).child('/follow').child(somekey).remove().then(async () => {
          await this.deleteFollower(followeeKey);
          resolve({success: true});
        })
      })
    });
  }


  deleteFollower(followeeKey) {
    return new Promise((resolve, reject) => {
      this.firedata.child(followeeKey).child('/followers').orderByChild('user_id').equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        let somekey;
        for (var key in snapshot.val())
          somekey = key;
        this.firedata.child(followeeKey).child('/followers').child(somekey).remove().then(() => {
          resolve({success: true});
        })
      })
    });
  }

  getAllPeopleThatIFollow() {
    //retrive all the user ids in follow child for the current user
    return new Promise((resolve, reject) => {
      let usersIds = [];
      let users = [];
      this.firedata.child(firebase.auth().currentUser.uid).child('/follow').on('value', async (snapshot) => {
        users = snapshot.val();
        for (var i in users) {
          usersIds.push(users[i].user_id);
        }
        usersIds.push(firebase.auth().currentUser.uid);

        resolve(usersIds);
      })
    });

  }
}
