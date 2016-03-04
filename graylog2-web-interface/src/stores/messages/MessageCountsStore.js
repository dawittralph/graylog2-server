import Reflux from 'reflux';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

import MessageCountsActions from 'actions/messages/MessageCountsActions';

const MessageCountsStore = Reflux.createStore({
  listenables: [MessageCountsActions],
  events: undefined,

  init() {
    this.total();
  },
  total() {
    const url = URLUtils.qualifyUrl(ApiRoutes.CountsApiController.total().url);
    const promise = fetch('GET', url).then((response) => {
      this.events = response.events;
      this.trigger({events: response.events});
      return response.events;
    });

    MessageCountsActions.total.promise(promise);

    return promise;
  },
});

export default MessageCountsStore;
