import {Injectable} from '@angular/core';
import firebase from "firebase";
import {Events} from "ionic-angular";
import {NotificationsProvider} from "../notifications/notifications";

/*
  Generated class for the FavoritesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoritesProvider {
  firedata = firebase.database().ref('/posts');

  constructor(public events: Events, public notificationService: NotificationsProvider) {
    console.log('Hello FavoritesProvider Provider');
  }

  favorite(userKey, postKey) {
    return new Promise((resolve, reject) => {
      this.firedata.child(userKey).child(postKey).child('/favorites').push({user_id: firebase.auth().currentUser.uid}).then(async () => {
        //and a record for the one he follows under the
        this.notificationService.store(userKey, {
          user_id: firebase.auth().currentUser.uid,
          model_id: '',
          model_type: '',
          seen: false
        });
        resolve({success: true});
      })
    });
  }

  unFavorite(userKey, postKey) {
    return new Promise((resolve, reject) => {
      console.log(userKey, postKey);
      this.firedata.child(userKey).child(postKey).child('/favorites').orderByChild('user_id').equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        let somekey;
        console.log(snapshot.val());
        for (var key in snapshot.val())
          somekey = key;
        this.firedata.child(userKey).child(postKey).child('/favorites').child(somekey).remove().then(() => {
          resolve({success: true});
        })
      })
    });
  }

}
