import {Injectable} from '@angular/core';
import firebase from "firebase";
import {Events} from "ionic-angular";
import {UserProvider} from "../user/user";

/*
  Generated class for the PostProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostProvider {
  firereq = firebase.database().ref('/posts');
  myFeed;

  constructor(public events: Events, public userService: UserProvider) {
    console.log('Hello PostProvider Provider');
  }

  getAll() {
    let allmyrequests;
    var myrequests = [];
    this.firereq.on('value', async (snapshot) => {
      allmyrequests = snapshot.val();
      myrequests = [];
      for (var i in allmyrequests) {
        //TODO should check if equal to the currunt user or the ones that he follows
        if (allmyrequests[i].user_id == firebase.auth().currentUser.uid) {
          //getting user details for each post .
          let user = await this.userService.getuserdetails(allmyrequests[i].user_id);
          allmyrequests[i].user = user;
          myrequests.push(allmyrequests[i]);
        }
      }

      this.myFeed = myrequests;
      this.events.publish('posts');
    })
  }


  addPost(post) {
    var promise = new Promise((resolve, reject) => {
      post.user_id = firebase.auth().currentUser.uid;
      post.created_at = firebase.database.ServerValue.TIMESTAMP;
      this.firereq.push(post).then(() => {
        resolve({success: true});
      })
    });
    return promise;
  }
}
