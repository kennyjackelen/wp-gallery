<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

	<!-- start styles -->
	<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url'); ?>/css/libs/min/bootstrap-all.min.css" />
	<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url'); ?>/css/main.min.css" />
	<!-- <link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url'); ?>/css/slideshow.css" /> -->
	<!-- end styles -->
	
	<?php wp_head(); ?>

  <link rel="alternate" type="application/rss+xml" href="<?php bloginfo('rss2_url'); ?>" title="<?php printf( __( '%s latest posts', 'your-theme' ), wp_specialchars( get_bloginfo('name'), 1 ) ); ?>" />
  <link rel="alternate" type="application/rss+xml" href="<?php bloginfo('comments_rss2_url') ?>" title="<?php printf( __( '%s latest comments', 'your-theme' ), wp_specialchars( get_bloginfo('name'), 1 ) ); ?>" />
  <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

</head>
<body>
<!--<img id="background-image" src="<?php bloginfo('template_url'); ?>/img/back.jpg">-->

<div id="navigation" class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container">
			<a class="btn btn-navbar" data-target=".nav-collapse" data-toggle="collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</a>
			<a class="brand" href="<?php bloginfo( 'url' ) ?>/"><?php bloginfo( 'name' ) ?></a>
			<div class="nav-collapse collapse" style="height: 0;">
				<form class="navbar-search pull-right" method="get" action="<?php bloginfo( 'home' ); ?>/">
					<input type="text" class="span2 search-query" placeholder="Search" name="s" id="s" >
				</form>
				<ul class="nav pull-right">
					<li <?php if(is_home()) { ?> class="active" <?php } ?>>
						<a href="<?php bloginfo( 'url' ) ?>/">Home</a>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle" href="#archives" data-toggle="dropdown">
							Archives
							<b class="caret"></b>
						</a>
						<ul class="dropdown-menu">
							<?php
								$args = array(
									'type' => 'monthly',
									'format' => 'html'
									);
								wp_get_archives($args);
							?>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle" href="#categories" data-toggle="dropdown">
							Categories
							<b class="caret"></b>
						</a>
						<ul class="dropdown-menu">
							<?php
								$args = array(
									'orderby' => 'name',
									'order' => 'ASC'
									);
								$categories = get_categories($args);
								foreach($categories as $category)
								{
							?>
							<li><a href="<?php echo get_category_link($category->term_id); ?>"><?php echo $category->name; ?></a></li>
							<?php
								}
							?>
						</ul>
					</li>
				</ul>
			</div><!-- .nav-collapse -->
		</div><!-- .container-fluid -->
	</div><!-- .navbar-inner -->
</div><!-- #navigation -->

<div id="wrapper" class="hfeed container-fluid">

  <div id="main">
