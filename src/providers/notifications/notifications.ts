import {Injectable} from '@angular/core';
import firebase from "firebase";
import {Events} from "ionic-angular";
import {UserProvider} from "../user/user";

/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider {
  firedata = firebase.database().ref('/notifications');
  active_notifications_count = 0;
  constructor(
    public events: Events,
    public userService: UserProvider
  ) {

  }

  store(targetedUser, message: { user_id: string, model_id: string, model_type: string, seen: boolean }) {
    return new Promise((resolve, reject) => {
      if (targetedUser != message.user_id) {
        message.seen = false; // the default message  is not seen
        this.firedata.child(targetedUser).push(message).then(async () => {
          //and a record for the one he follows under the
          this.events.publish('notifications');

          resolve({success: true});
        })
      }

    });
  }

  get(userId) {
    return new Promise((resolve, reject) => {

      this.firedata.child(userId).on('value', async (snapshot) => {
        console.log(snapshot.val());
        resolve(snapshot.val());
      })
    });

  }

  count_my_notification() {
    this.active_notifications_count = 0;
    return new Promise(async (resolve, reject) => {
      let allObjectNotifications = await this.get(firebase.auth().currentUser.uid);
      let counter = 0;
      for (let position in allObjectNotifications) {
        allObjectNotifications[position].uid = position;
        if (!allObjectNotifications[position].seen) {
          counter++;
        }
      }
      this.active_notifications_count = counter;
      return resolve(counter);
    });

  }

  updateNotification(notification) {
    return new Promise((resolve, reject) => {
      // it will only update the notification from un seen to seen

      this.firedata.child(firebase.auth().currentUser.uid).child(notification.uid).update(notification).then(() => {
        this.active_notifications_count--;
        this.events.publish('active_notification_count');
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    })
  }

  notifyFollowers(model_id, model_type = 'post') {
    let user_id = firebase.auth().currentUser.uid;
    this.userService.getMyFollowers().then(users => {
      for (let user in users) {
        let targeted_user = users[user].user_id;
        console.log("user id", user, targeted_user);
        this.store(targeted_user, {user_id: user_id, model_id, model_type, seen: false})
      }
    })
  }
}
