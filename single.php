<?php get_header(); ?>
<div id="container">
 
    <div id="content">

			<?php while ( have_posts() ) :the_post(); ?>
			<div class="single-post">
				<div class="post-title"><a href="<?php echo get_permalink($id); ?>"><?php the_title(); ?></a></div>
				<div class="post-date"><?php the_date('l, F j, Y'); ?></div>
				
				<?php the_content(); ?>
				
				<div class="post-categories hidden-phone">
					<?php
						$categories = wp_get_post_categories($id);
						if(count($categories) == 1)
						{
							echo "Category: ";
						}
						else if(count($categories) > 1)
						{
							echo "Categories: ";
						}
						foreach($categories as $c)
						{
							$cat = get_category($c);
					?>
					<!--<a href="<?php echo get_category_link($cat->term_id); ?>">-->
						<a class="label label-inverse" href="<?php echo get_category_link($cat->term_id); ?>"><?php echo $cat->name; ?></a>
					<!--</a>-->
					<?php
						}
					?>
				</div><!-- .post-categories -->
			</div><!-- .single-post -->

			<?php endwhile; ?>
    </div><!-- #content -->
    
    <div id="nav-below">
      <div class="nav-previous"><?php previous_post_link(); ?></div>
      <div class="nav-next"><?php next_post_link(); ?></div>
    </div><!-- #nav-below -->
 
</div><!-- #container -->
 
<div id="primary" class="widget-area">
</div><!-- #primary .widget-area -->
 
<div id="secondary" class="widget-area">
</div><!-- #secondary -->
<?php get_footer(); ?>
