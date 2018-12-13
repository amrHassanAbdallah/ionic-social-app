import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationsProvider} from "../../providers/notifications/notifications";
import firebase from "firebase";
import {UserProvider} from "../../providers/user/user";
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  myNotification = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public notificationService: NotificationsProvider, public userService: UserProvider, public imageHandler: ImghandlerProvider) {
  }

  ionViewWillEnter() {
    this.notificationService.get(firebase.auth().currentUser.uid).then(async notifications => {
      let localNotifications = [];
      for (let i in notifications) {
        let object = notifications[i];
        object.uid = i;
        object.user = await this.userService.getuserdetails(object.user_id);
        object.user.photoURL = await this.imageHandler.getAuserImage(object.user_id);
        localNotifications.push(object);
      }
      this.myNotification = localNotifications;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

}
