import {Injectable} from '@angular/core';
import firebase from "firebase";
import {Events} from "ionic-angular";

/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider {
  firedata = firebase.database().ref('/notifications');

  constructor(
    public events: Events
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
    return new Promise(async (resolve, reject) => {
      let allObjectNotifications = await this.get(firebase.auth().currentUser.uid);
      let counter = 0;
      for (let position in allObjectNotifications) {
        allObjectNotifications[position].uid = position;
        if (!allObjectNotifications[position].seen) {
          counter++;
        }
      }
      return resolve(counter);
    });

  }

  updateNotification(notification) {
    return new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).child(notification.uid).update(notification).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    })
  }

}
