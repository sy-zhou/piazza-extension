
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

const moveDivsAround = () => {
  // move new post button to top bar
  $('#popular_tags_bar').prepend( $('#new_post_button') );

  // move filters to top bar
  $('#page_feed_filter_buttons').insertBefore( $('#popular_tags_list') );
  // hide some filters
  $('#page_feed_filter_buttons').children().each(function() {
    if (!this.style.display) {
      $(this).hide();
    }
  });

  // hide some stuff in top bar
  $('#popular_tags_bar').children('ul').eq(0).hide();
  $('#popular_tags_bar').children('span').eq(0).hide();
  $('#popular_tags_bar').children('span').eq(1).hide();
  $('#openMoreFolders').hide();

  // search bar
  $('.page_feed_search_wrapper').insertAfter( $('.hide_show_feed.hide_feed') );
  $('.feed_options_arrow').hide();

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

  moveDivsAround();

  $('.networkDropdown').on('click', function() {
    $('#feed_search').prepend($('#new_post_button'));
    $('.page_feed_tool_bar').prepend($('#page_feed_filter_buttons'));
  });

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == 'post_change') {
    modifyPostRegionNoteBar();
  } else if (request.type == 'course_change') {
    setTheme();
    moveDivsAround();
  }
});

chrome.storage.local.get('enabled', data => {
  if (data.enabled) {
    console.log('Welcome to Piazza!');

    setTheme();
    document.querySelector('head').innerHTML += `<link rel="stylesheet" type="text/css" href="${chrome.extension.getURL('base.css')}" />`;
    doStuff();
    modifyPostRegionNoteBar();

    // set observer for moving question feed up and down
    const questionFeed = document.getElementById('question_feed_questions');

    let observer = new MutationObserver((mutations, _) => {
      for (mutation of mutations) {
        const {type, attributeName} = mutation;
        if (type === 'attributes' && attributeName === 'style') {
          questionFeed.classList.remove('contract_row');
          questionFeed.classList.remove('contract_search_tips');
          if (questionFeed.style.top == '91px') {
            questionFeed.classList.add('contract_row');
          } else if (questionFeed.style.top == '345px') {
            questionFeed.classList.add('contract_search_tips');
          }
        }
      }
    });
    observer.observe(questionFeed, { attributes: true });
  }
});
