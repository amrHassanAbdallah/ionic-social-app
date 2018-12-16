import {Injectable} from '@angular/core';
import firebase from "firebase";
import {Events} from "ionic-angular";
import {UserProvider} from "../user/user";
import {ImghandlerProvider} from "../imghandler/imghandler";

/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider {
  firedata = firebase.database().ref('/notifications');
  active_notifications_count = 0;
  my_notification = [];
  constructor(
    public events: Events,
    public userService: UserProvider,
    public imageHandler: ImghandlerProvider
  ) {

  }

  store(targetedUser, message/*: { user_id: string, model_id: string, model_type: string, seen: boolean }*/) {
    return new Promise((resolve, reject) => {
      if (targetedUser != message.user_id) {
        message.seen = false; // the default message  is not seen
        this.firedata.child(targetedUser).push(message).then(async (item) => {
          /*          if (targetedUser ==firebase.auth().currentUser.uid ){
                      //and a record for the one he follows under the
                      message.uid = item.key;
                      this.my_notification.push(message);
                      this.events.publish('notifications');
                      this.active_notifications_count++;
                      this.events.publish('active_notification_count');
                    }*/

          resolve({success: true});
        })
      }

    });
  }

  get(userId) {
    return new Promise((resolve, reject) => {

      this.firedata.child(userId).on('value', async (snapshot) => {
        let notifications = snapshot.val();
        this.active_notifications_count = 0;
        this.my_notification = [];
        for (let i in notifications) {
          let object = await this.notificationSetUp(notifications, i);
          this.my_notification.push(object);
          if (!object.seen) {
            this.active_notifications_count++;
          }
        }
        // this.events.publish('active_notification_count');
        this.events.publish('notifications');

        console.log(snapshot.val());
        //resolve(this.my_notification);
      })
    });

  }

  count_my_notification() {
    this.active_notifications_count = 0;
    return new Promise(async (resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).on('value', async (snapshot) => {
        let notifications = snapshot.val();
      let counter = 0;
        for (let position in notifications) {
          notifications[position].uid = position;
          if (!notifications[position].seen) {
          counter++;
        }
      }
      this.active_notifications_count = counter;
      return resolve(counter);
    });
    });

  }

  private async notificationSetUp(notifications, i) {
    let object = notifications[i];
    object.uid = i;
    object.user = await this.userService.getuserdetails(object.user_id);
    object.user.photoURL = await this.imageHandler.getAuserImage(object.user_id);
    switch (object.model_type) {
      case "favorite":
        object.message = `${object.user.displayName} favorite  your  post . `;
        break;
      case "unfavorite":
        object.message = `${object.user.displayName} un favorite  your  post . `;
        break;
      case "post":
        object.message = `${object.user.displayName} created a new post  . `;
        break;
      case "follow":
        console.log("follow");
        object.message = `${object.user.displayName} followed you . `;
        break;
    }
    return object;
  }

  updateNotification(notification) {
    return new Promise((resolve, reject) => {
      // it will only update the notification from un seen to seen

      this.firedata.child(firebase.auth().currentUser.uid).child(notification.uid).update(notification).then(() => {
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
