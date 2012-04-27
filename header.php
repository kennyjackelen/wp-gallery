<!doctype html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>
		<?php

		  if ( is_single() ) { single_post_title(); }
		  elseif ( is_home() || is_front_page() ) { bloginfo('name'); print ' | '; bloginfo('description'); get_page_number(); }
		  elseif ( is_page() ) { single_post_title(''); }
		  elseif ( is_search() ) { bloginfo('name'); print ' | Search results for ' . wp_specialchars($s); get_page_number(); }
		  elseif ( is_404() ) { bloginfo('name'); print ' | Not Found'; }
		  else { bloginfo('name'); wp_title('|'); get_page_number(); }

		?>
	</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_url'); ?>" />
	
	<?php wp_head(); ?>

  <link rel="alternate" type="application/rss+xml" href="<?php bloginfo('rss2_url'); ?>" title="<?php printf( __( '%s latest posts', 'your-theme' ), wp_specialchars( get_bloginfo('name'), 1 ) ); ?>" />
  <link rel="alternate" type="application/rss+xml" href="<?php bloginfo('comments_rss2_url') ?>" title="<?php printf( __( '%s latest comments', 'your-theme' ), wp_specialchars( get_bloginfo('name'), 1 ) ); ?>" />
  <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

</head>
<body>
<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container">
			<!-- .btn-navbar is used as the toggle for collapsed navbar content -->
			<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</a>
			 
			<!-- Be sure to leave the brand out there if you want it shown -->
			<a class="brand" href="#"><?php bloginfo( 'name' ) ?></a>
			 
			<!-- Everything you want hidden at 940px or less, place within here -->
			<div class="nav-collapse">
				<!-- .nav, .navbar-search, .navbar-form, etc -->
				<form class="navbar-search pull-right" action="">
					<input class="search-query span2" type="text" placeholder="Search">
				</form>
				<ul class="nav pull-right">
					<li class="nav"><a href="<?php bloginfo( 'url' ) ?>/">Home</a></li>
					<li class="dropdown">
						<a class="dropdown-toggle" href="#archives" data-toggle="dropdown">
							Archives
							<b class="caret"></b>
						</a>
						<ul class="dropdown-menu">
							<li><a href="#">Some month</a></li>
							<li><a href="#">Another month</a></li>
							<li><a href="#">And so on</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle" href="#categories" data-toggle="dropdown">
							Categories
							<b class="caret"></b>
						</a>
						<ul class="dropdown-menu">
							<li><a href="#">Some category</a></li>
							<li><a href="#">Another category</a></li>
							<li><a href="#">And so on</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<div id="wrapper" class="hfeed container-fluid">
  <div id="header" class="hidden-phone">

			<div id="blog-title"><span><a href="<?php bloginfo( 'url' ) ?>/" title="<?php bloginfo( 'name' ) ?>" rel="home">
				<?php bloginfo( 'name' ) ?>
			</a></span></div>

			<div id="blog-description"><?php bloginfo( 'description' ) ?></div>

  </div><!-- #header -->

  <div id="main">
