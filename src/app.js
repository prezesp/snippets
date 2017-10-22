// Konfiguracja
var config = {
	title: "Nauka SQL",
	url: "snippets.json",
	lang: "sql",
	show_immediately: false

}

// Zapisywanie kliknięć w storage
function saveSnippets(v_id, v_state) {
	var sn = top.localStorage.getItem('snippets-notebook') || '[]';
	sn = JSON.parse(sn).filter(function(element) {
		return element.id != v_id;
	});
	sn.push({
		id: v_id,
		state: v_state
	});
	top.localStorage.setItem('snippets-notebook', JSON.stringify(sn));
};

function loadSnippets() {
	var sn = top.localStorage.getItem('snippets-notebook') || '[]';
	sn = JSON.parse(sn).filter(function(element) {
		return element.state == true;
	}).map(a => a.id);
	return sn;
}

// Zmiana klasy dla buttona
function toggleClass(b, id) {
	console.log($(b));
	var mark = $(b).hasClass('btn-secondary');

	if (mark) {
		$(b).addClass('btn-success').removeClass('btn-secondary');
	} else {
		$(b).addClass('btn-secondary').removeClass('btn-success');
	}

	saveSnippets(id, mark); 
};

$( document ).ready(function() {
	$('.btn-refresh').click(function() {
		top.localStorage.removeItem('snippets-notebook');
		location.reload();
	});
	var $container = $('.container:first');
	$container.find('h2:first').html(config.title);
	
	// Pobanie snippetów z okreslonego zasobu (url)
	$.get({
		url: config.url,
		success: function(snippets) {
			var completedSnippets = loadSnippets();
			snippets.forEach(function(s, i) {
				var $pointDiv = $('<div/>', {
					'class': 'row point',
					'html': '<div class="col"><h4>' + (i+1) + '. ' + s.title + '</h4></div>'
				}).appendTo($container);
				s.fragments.forEach(function(fragment, j){
					$('<div/>', {
						'class': 'col',
						'html': '<p>' + (fragment.text || '') + '</p><div class="card"><div class="card-body"><pre><code class="' + config.lang + '">' + (fragment.code || '') + '</code></pre></div></div>'
					}).appendTo($pointDiv.find("div:first"));
					var snippet_id = i + '_' + j;
					$('<div/>', {
						'class': 'col text-right',
						'html': '<button type="button" onClick="toggleClass(this, \'' + snippet_id + '\')" class="btn btn-lg ' + (completedSnippets.indexOf(snippet_id) != -1 ? 'btn-success' : 'btn-secondary') + '"><i class="fa fa-check" aria-hidden="true"></i></button>'
					}).appendTo($pointDiv.find("div:first"));
				});
				
			});

			// Wyświetlanie punktów przy scrollowaniu
			if (!config.show_immediately) {
				window.sr = ScrollReveal({ reset: false, viewFactor : 0.7 });
				sr.reveal('.point');
			}

			// Ustawienie kolorwania składni
			hljs.initHighlighting();
		}
	})
});


