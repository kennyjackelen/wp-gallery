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
				<form class="navbar-search pull-right">
					<input type="text" class="span2 search-query" placeholder="Search">
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
  <!--<div id="header" class="hidden-phone">

			<div id="blog-title"><span><a href="<?php bloginfo( 'url' ) ?>/" title="<?php bloginfo( 'name' ) ?>" rel="home">
				<?php bloginfo( 'name' ) ?>
			</a></span></div>

			<div id="blog-description"><?php bloginfo( 'description' ) ?></div>

  </div><!-- #header -->

  <div id="main">
