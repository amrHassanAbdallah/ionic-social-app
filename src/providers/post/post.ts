import {Injectable} from '@angular/core';
import firebase from "firebase";
import {Events} from "ionic-angular";
import {UserProvider} from "../user/user";
import {FollowProvider} from "../follow/follow";

/*
  Generated class for the PostProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostProvider {
  firereq = firebase.database().ref('/posts');
  myFeed;

  constructor(public events: Events, public userService: UserProvider, public followService: FollowProvider) {
    console.log('Hello PostProvider Provider');
  }

  async getAll() {
    let allmyrequests;
    var myrequests = [];
    // should get all people this user follows
    let peopleIfollow = await this.followService.getAllPeopleThatIFollow();
    this.myFeed = await this.getAllPostsForPeopleILike(peopleIfollow);
    // console.log("Here is your feed", this.myFeed);
    this.events.publish('posts');





  }

  getPostsAssiciatedWithOnePerson(personKey) {
    return new Promise((resolve, reject) => {
      this.firereq.child(personKey).once('value', s => {
        console.log(s.val());
        let result = s.val();
        if (result) {
          result = Object.values(result);
        }
        resolve(result);
      })
    })
  }

  async getAllPostsForPeopleILike(peopleIfollow) {
    let posts = [];
    for (let location in peopleIfollow) {
      let postsByThisUser = await this.getPostsAssiciatedWithOnePerson(peopleIfollow[location]);
      for (let post in postsByThisUser) {
        postsByThisUser[post].user = await this.userService.getuserdetails(peopleIfollow[location]);
        posts.push(postsByThisUser[post]);
      }
    }

    console.log("Here is after", posts);
    return posts;
  }

  addPost(post) {
    return new Promise((resolve, reject) => {
      post.created_at = firebase.database.ServerValue.TIMESTAMP;
      this.firereq.child(firebase.auth().currentUser.uid).push(post).then(() => {
        resolve({success: true});
      })
    });
  }
}
