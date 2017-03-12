// auth

$(document).ready(function() {
  //slider
  $(".reve").niceScroll({cursorcolor:"#c0bfbf"});
  $("html").niceScroll({cursorcolor:"#fff"});
  //slider
  $('.this_list li:gt(0)').hide();
  setInterval(function() {
    $('.this_list > :first-child').fadeOut(4000).next('li').fadeIn(4000).end().appendTo('.this_list');
  }, 4000);

  //to signup
  $('#login-btn').on('click', function() {
    window.location.href = "/users/login";
  });

  //to login
  $('#sign-btn').on('click', function() {
    window.location.href = "/users/signup";
  });

  //ajax get data comments
  $.getJSON('/posts/the-comments', function(data) {
    data.posts.forEach(function(post) {

      var cmtId = $('#comment-data-' + post.id);
      var voteLength = $('#vote_length_' + post.id);
      var komLength = $('#length_kom_' + post.id);

      cmtId.html('');
      voteLength.html('');
      komLength.html('');

      kandei(post);
      liker(post);

      if (post.comments.length > 1) {
        komLength.append('\
          <span> view all ' + post.comments.length + ' comments</span>\
        ');
      } else if (post.comments.length === 0) {
        komLength.append('\
          <span> no comment</span>\
        ');
      } else {
        komLength.append('\
          <span> view a comment</span>\
        ');
      };

      voteLength.append('\
        <p class="lke"> ' + post.votes.length + ' likes</p>\
      ');

      post.comments.forEach(function(comment) {
        cmtId.append('\
        <li class="caption">\
          <a href="' + comment.user.username + '" class="name">' + comment.user.username + '</a> <span>' + comment.body + '</span>\
        </li>\
        ');
      });
    });


  });

  //ajax post comments
  var kandei = function(data) {
    $('#create-comment-' + data.id).on('submit', function(e) {
      $.ajax({
        type: 'POST',
        url: '/posts/comment',
        data: JSON.stringify({
          comment: $('#body_id_' + data.id).val(),
          postid: $('#post_id_' + data.id).val(),
          usrid: $('#usr_id_' + data.id).val()
        }),
        contentType: 'application/json',
        success: function(res) {
          // $('#post_id_' + data.id).val('');
          $('#body_id_' + data.id).val('');
          $.getJSON('/posts/the-comments', function(data) {
            data.posts.forEach(function(post) {
              var cmtId = $('#comment-data-' + post.id);
              cmtId.html('');
              var komLength = $('#length_kom_' + post.id);
              komLength.html('');
              if (post.comments.length > 1) {
                komLength.append('\
                  <span> view all ' + post.comments.length + ' comments</span>\
                ');
              } else if (post.comments.length === 0) {
                komLength.append('\
                  <span> no comment</span>\
                ');
              } else {
                komLength.append('\
                  <span> view a comment</span>\
                ');
              };
              post.comments.forEach(function(comment) {
                cmtId.append('\
                <li class="caption">\
                  <a href="' + comment.user.username + '" class="name">' + comment.user.username + '</a> <span>' + comment.body + '</span>\
                </li>\
                ');
              });
            });
          });
        }
      });
      e.preventDefault();
    });
  };

  //ajax post like
  var liker = function(data) {
    var current_id = $('#current-us').data('current');
    //like post
    $('#like_' + data.id).on('click', function(e) {
      e.preventDefault();
      $.ajax({
        type: 'POST',
        url: '/posts/' + data.id + '/votes',
        data: JSON.stringify({
          tuser: $('#tuser_'+data.id).val()
        }),
        contentType: 'application/json',
        success: function() {
          $.getJSON('/posts/the-comments', function(foo) {
            foo.posts.forEach(function(post) {
              var voteLength = $('#vote_length_' + post.id);
              voteLength.html('');
              voteLength.append('\
                <p class="lke"> ' + post.votes.length + ' likes</p>\
              ');
            });
            var prevolike = $('#prevolike_' + data.id);
            prevolike.html('\
              <a class="like_btn red_btn" id="dislike_' + data.id + '">\like</a>\
            ');
          });
        }
      });

    });
    $('#dislike_' + data.id).on('click', function(e) {
      e.preventDefault();

      function isEqual(foo) {
        return foo.userId === current_id;
      }
      var vote = data.votes.find(isEqual);
      console.log(vote.id);
      if (current_id === vote.userId) {
        $.ajax({
          type: 'GET',
          url: '/posts/delete/vote/' + vote.id,
          success: function(res) {
            $.getJSON('/posts/the-comments', function(foo) {
              foo.posts.forEach(function(post) {
                var voteLength = $('#vote_length_' + post.id);
                voteLength.html('');
                voteLength.append('\
                    <p class="lke"> ' + post.votes.length + ' likes</p>\
                  ');
              });
              var prevdlike = $('#prevdlike_' + data.id);
              prevdlike.html('\
                  <a class="like_btn" id="like_' + data.id + '">\like</a>\
                ');
            });
          }
        });
      };
    });
  };

  // auto complete search & still not working
  $('#search_data').typeahead({
    name: 'users',
    remote: 'http://localhost:3000/posts/search?key=%QUERY',
    limit: 3
  });

  //get notifications
  $.getJSON('/posts/notifications', function(data){
    var current_id = $('#notifs').data('crt');
    var notif_foo = $('#notifs');
    notif_foo.html('');
    $.each(data.notifs, function(key, notif){
      var time_ago = function(tme){
        var msperMinute = 60 * 1000;
        var msperHour = msperMinute * 60;
        var msperDay = msperHour * 24;
        var msperMonth = msperDay * 30;
        var msperYear = msperDay * 365;

        var current = new Date();
        var previous = new Date(tme);
        var elapsed = Math.abs(current - previous);
        if(elapsed < msperMinute){
          return Math.round(elapsed/1000) + 's';
        } else if(elapsed < msperHour){
          return Math.round(elapsed/msperMinute) + 'm';
        } else if (elapsed < msperDay) {
          return Math.round(elapsed/msperHour) + 'h';
        } else if (elapsed < msperMonth) {
          return Math.round(elapsed/msperDay) + 'd';
        } else if (elapsed < msperYear) {
          return Math.round(elapsed/msperMonth) + 'mo';
        } else {
          return Math.round(elapsed/msperYear) + 'y';
        }
      };
      if(current_id === notif.userId){
        notif_foo.append(
          '<li class="this_notif" id="notif_'+ notif.id +'">' +
            '<div class="left-photo col-md-2">' +
              '<img src="/uploads/profile/'+notif.notified_by.avatar+'" alt="">' +
            '</div>' +
            '<div class="right-caption col-md-10">' +
              '<span class="usr-name" id="link_to_'+ notif.notified_by.id +'">@'+ notif.notified_by.username +'</span>' +
              '<span class="cap-ion"> ' + notif.notice_type +' '+ (notif.post ? notif.post.caption.substring(0, 50) : 'you as friends') +'</span>' +
              (notif.read === true ? '<span class="read"> Read</span>' : '' ) +
              '<span class="pull-right cap-ion bardf">'+ time_ago(notif.createdAt) +' ago</span>' +
            '</div>' +
            '<div class="clear"></div>' +
          '</li>'
        );
      }
      $('#link_to_'+notif.notified_by.id).on('click', function(){
        window.location.href = "/" + notif.notified_by.username;
      });
      $('#notif_'+notif.id).on('click', function(){
        $.ajax({
          url: '/posts/notif/' + notif.id,
          type: 'PUT',
          success: function(){
            window.location.href="/" + notif.notified_by.username;
          }
        });
      });
    });
  });

  // follow user
  $('#foobar').on('click', function(){
    var follid = $('#foobar').data('foobar');
    $.ajax({
      type: 'POST',
      url: '/relationships/follow/' + follid,
      success: function() {
        $('#following').html(
          '<a href="#" class="btn-follow">Following</a>'
        );
      }
    });
  });

  // gets all comment
  $.getJSON('/posts/we-comen', function(data){
    $.each(data.posts, function(key, post){
      var comen = $('#comen-data-' + post.id);
      comen.html('');
      $.each(post.comments, function(key, comment){
        comen.append(
          '\
          <li class="caption">\
            <a href="' + comment.user.username + '" class="name">' + comment.user.username + '</a> <span>' + comment.body + '</span>\
          </li>\
          '
        );
      });
    });
  });

});
