var api = require('sendwithus')(process.env.SENDWITHUS_KEY),
  Promise = require('bluebird'),
  sendEmail = Promise.promisify(api.send, api);

var defaultOptions = {
  sender: {
    address: process.env.EMAIL_SENDER,
    name: 'Hylo'
  }
};

module.exports = {

  sendPasswordReset: function(opts) {
    return sendEmail(_.merge({}, defaultOptions, {
      email_id: 'tem_mccpcJNEzS4822mAnDNmGT',
      recipient: {address: opts.email},
      email_data: opts.templateData
    }));
  },

  sendInvitation: function(email, data) {
    return sendEmail(_.merge({}, defaultOptions, {
      email_id: 'tem_ZXZuvouDYKKhCrdEWYbEp9',
      recipient: {address: email},
      email_data: data,
      version_name: 'user-edited text',
      sender: {
        name: format('%s (via Hylo)', data.inviter_name),
        reply_to: data.inviter_email
      }
    }));
  },

  sendNewCommentNotification: function(opts) {
    return sendEmail(_.merge({}, defaultOptions, {
      email_id: 'tem_tP6JzrYzvvDXhgTNmtkxuW',
      recipient: {address: opts.email},
      email_data: opts.data,
      version_name: opts.version,
      sender: opts.sender
    }));
  },

  sendPostMentionNotification: function(opts) {
    return sendEmail(_.merge({}, defaultOptions, {
      email_id: 'tem_wXiqtyNzAr8EF4fqBna5WQ',
      recipient: {address: opts.email},
      email_data: opts.data,
      sender: opts.sender
    }));
  },

  sendCommunityDigest: function(opts) {
    return sendEmail(_.merge({}, defaultOptions, {
      email_id: 'tem_rkZiuPHBvLDFrZ6rv8VixH',
      recipient: {address: opts.email},
      email_data: opts.data
    }));
  },

  postReplyAddress: function(postId, userId) {
    var plaintext = format('%s%s|%s', process.env.MAILGUN_EMAIL_SALT, postId, userId);
    return format('reply-%s@%s', PlayCrypto.encrypt(plaintext), process.env.MAILGUN_DOMAIN);
  },

  decodePostReplyAddress: function(address) {
    var salt = new RegExp(format('^%s', process.env.MAILGUN_EMAIL_SALT)),
      match = address.match(/reply-(.*?)@/),
      plaintext = PlayCrypto.decrypt(match[1]).replace(salt, ''),
      ids = plaintext.split('|');

    return {postId: ids[0], userId: ids[1]};
  }

};