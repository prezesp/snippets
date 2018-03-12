import {cfg} from './config.js';


var Course = function() {
	this.config = cfg();
}

/** 
  * @desc Save course progress in local storage.
  * @param int v_id - unique identifier of course step.
  * @param bool v_state - indicates step is accomplished or not.
*/
Course.prototype.saveSnippets = function(v_id, v_state) {
	var sn = top.localStorage.getItem('snippets-notebook') || '[]';
	sn = JSON.parse(sn).filter(function(element) {
		return element.id != v_id;
	});
	sn.push({
		id: v_id,
		state: v_state
	});
	top.localStorage.setItem('snippets-notebook', JSON.stringify(sn));

	// update score
	var $score = $('.score');
	$score.find('.panel-body span:nth-child(1)').html(sn.filter(s => s.state).length);
};

/**
  * @desc Load course progress from local storage.
*/
Course.prototype.loadSnippets = function() {
	var sn = top.localStorage.getItem('snippets-notebook') || '[]';
	sn = JSON.parse(sn).filter(function(element) {
		return element.state == true;
	}).map(a => a.id);

	// update score
	var $score = $('.score');
	$score.find('.panel-body span:nth-child(1)').html(sn.length);
	return sn;
};

Course.prototype.toggleClass = function(b, id) {
	var mark = $(b).hasClass('btn-secondary');

	if (mark) {
		$(b).addClass('btn-success').removeClass('btn-secondary');
	} else {
		$(b).addClass('btn-secondary').removeClass('btn-success');
	}

	this.saveSnippets(id, mark); 
};



$( document ).ready(function() {
	var course = new Course();

	$('.btn-refresh').click(function() {
		top.localStorage.removeItem('snippets-notebook');
		location.reload();
	});
	var $container = $('.container:first');
	var $score = $('.score');
	
	// Get snippets from predefined url
	$.get({
		url: course.config.url,
		success: function(data) {

			// Apply metadata to view
			$container.find('h2:first').html(data.title);
			$container.find('p:first').html(data.subtitle);
			$score.find('.panel-body span:nth-child(2)').html(data.snippets.length);

			// Render snippets
			var completedSnippets = course.loadSnippets();
			data.snippets.forEach(function(s, i) {
				var $pointDiv = $('<div/>', {
					'class': 'row point',	
					'html': '<div class="col-lg-offset-1 col-lg-10" style="float:unset !important"><h4>' + (i+1) + '. ' + s.title + '</h4></div>'
				}).appendTo($container);

				s.fragments.forEach(function(fragment, j){
					$('<div/>', {
						'class': 'col',
						'html': '<p>' + (fragment.text || '') + '</p><div class="card"><div class="card-body"><pre><code class="' + data.lang + '">' + (fragment.code || '') + '</code></pre></div></div>'
					}).appendTo($pointDiv.find("div:first"));
					var snippet_id = i + '_' + j;

					var buttonDiv = $('<div/>', {
						'class': 'col text-right'
					}).appendTo($pointDiv.find("div:first"));

					$('<button/>', {
						'type': 'button',
						'click': function() {
							course.toggleClass(this, snippet_id);
						},
						'class': 'btn btn-lg ' + (completedSnippets.indexOf(snippet_id) != -1 ? 'btn-success' : 'btn-secondary'),
						'html' : '<i class="fa fa-check" aria-hidden="true"></i></button>'
					}).appendTo(buttonDiv);
				});
				
			});

			// Use scrollreveal
			if (!course.config.show_immediately) {
				window.sr = ScrollReveal({ reset: false, viewFactor : 0.7 });
				sr.reveal('.point');
			}

			// Syntax highlighting
			hljs.initHighlighting();
		}
	})
});


