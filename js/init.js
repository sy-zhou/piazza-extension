
const setTheme = () => {
  // check class on 'top_bar' to get accent color and then change css's main colors
  const theme = document.getElementById('top_bar').classList[3]; // 4th class is color

  if (theme != undefined) {
    fetch(chrome.extension.getURL('../themes.json'))
      .then((resp) => resp.json())
      .then((data) => {

        let root = document.querySelector(":root");
        for (let property in data[theme]) {
          root.style.setProperty(property, data[theme][property]);
        }
      });
  }

}

const modifyPostRegionNoteBar = () => {
  // post region question box modifications
  $('<div>')
    .addClass('post_vote_block')
    .prepend( $('#view_question_note_bar').children().eq(4) )
    .prepend( $('#view_question_note_bar').children().eq(3) )
    .prepend( $('#view_question_note_bar').children().eq(2) )
    .appendTo( $('#view_question_note_bar') );

    $('#view_question_note_bar').children().eq(1).remove();

  // post region student answer box modifications
  $('#s_answer').children().eq(6).attr('id', 'view_student_answer_note_bar');
  $('<div>')
    .addClass('post_vote_block')
    .prepend( $('#view_student_answer_note_bar').children().eq(4) )
    .prepend( $('#view_student_answer_note_bar').children().eq(3) )
    .prepend( $('#view_student_answer_note_bar').children().eq(2) )
    .appendTo( $('#view_student_answer_note_bar') );

  $('#view_student_answer_note_bar').children().eq(1).remove();

  // instructor answer box modifications
  $('#i_answer').children().eq(5).attr('id', 'view_instructor_answer_note_bar');
  $('<div>')
    .addClass('post_vote_block')
    .addClass('vote_instructor')
    .prepend( $('#view_instructor_answer_note_bar').children().eq(2) )
    .prepend( $('#view_instructor_answer_note_bar').children().eq(1) )
    .prepend( $('#view_instructor_answer_note_bar').children().eq(0) )
    .appendTo( $('#view_instructor_answer_note_bar') );

}

const doStuff = () => {
  // first attempt to make page feed resizeable

  const pageFeed = document.getElementById('feed');
  const pageCenter = document.getElementById('page_center');
  const pageBottomBar = document.getElementById('page_bottom_bar');

  let m_pos;
  function resize(e) {
    const dx = e.x - m_pos;
    m_pos = e.x;
    const width = parseInt(getComputedStyle(pageFeed, '').width) + dx;
    pageFeed.style.width = width + "px";
    pageCenter.style.left = width + "px";
    pageBottomBar.style.left = width + "px";
  }

  pageFeed.addEventListener('mousedown', (e) => {
    if ($('#feed').width() - e.offsetX <= 3) {
      m_pos = e.x;
      document.addEventListener('mousemove', resize, false);
    }
  });

  document.addEventListener("mouseup", function(){
    document.removeEventListener("mousemove", resize, false);
  });

  // move new post button to top bar

  // $('#bars').prepend( $('#new_post_button') );
  $('#feed').append( $('#new_post_button') );

  // move filters to top bar and hide some of them
  $('#page_feed_filter_buttons').insertBefore( $('#popular_tags_list') );
  $('#popular_tags_bar').children('ul').eq(0).hide();
  $('#popular_tags_bar').children('span').eq(0).hide();
  $('#popular_tags_bar').children('span').eq(1).hide();
  $('#shortcut_due').hide();
  $('#shortcut_hidden').hide();
  $('#shortcut_hide_group_posts').hide();

  $('.page_feed_search_wrapper').insertAfter( $('.hide_show_feed.hide_feed') );
  $('.feed_options_arrow').hide();

  // adjust page feed 'top' height so as to not cover bar that appears when filters are on
  $('#page_feed_filter_buttons').children().addClass('manual_filter');
  $('#popular_tags_list').children().addClass('manual_filter');

  $('.manual_filter').on('click', function() {
    $('#question_feed_questions').addClass('question_feed_questions_contract');
  });

  // re-establish height when filter is closed
  $('.clear_filter').on('click', function() {
    $('#question_feed_questions').removeClass('question_feed_questions_contract');
  });


}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == 'post_change') {
    modifyPostRegionNoteBar();
  }
});

chrome.storage.sync.get('enabled', data => {
  if (data.enabled) {
    console.log('Welcome to Piazza!');

    setTheme();
    document.querySelector('head').innerHTML += `<link rel="stylesheet" type="text/css" href="${chrome.extension.getURL('base.css')}" />`;
    doStuff();
    modifyPostRegionNoteBar();
  }
});
