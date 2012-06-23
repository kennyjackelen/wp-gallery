<?php get_header(); ?>
<div id="container">
 
    <div id="content">
    	<?php if ( !is_singular() && !is_home() ) { ?>
    	<div class="page-title row-fluid">
    		<div class="page-title-inner span12">
    			<?php 
    				if ( is_category() )
    				{
    					echo "Categories";
    					wp_title();
    				}
    				else if ( is_archive() )
    				{
    					echo "Archives";
    					wp_title();
    				}
    				else if ( is_search() )
    				{
    					echo substr( wp_title( '&raquo;', false ), 9 );  // trim 9 characters = ' &raquo; '
    				}
    			?>
  			</div>
    	</div>
    	<?php } ?>
    
			<?php $count = 0; ?>
			<?php while ( have_posts() ) :the_post(); ?>
			<?php $count++; ?>
			<div class="post row-fluid" >
				<?php if($count % 2 == 1) { ?>
				<a class="post-image span5" href="<?php echo get_permalink($id); ?>">
					<img class="post-image-inner" src="<?php echo full_image_url($id); ?>">
				</a>
				<?php } ?>
				<div class="post-info span7">
					<div class="post-title"><a href="<?php echo get_permalink($id); ?>"><?php the_title(); ?></a></div>
					<div class="post-date"><?php echo get_the_date('l, F j, Y'); ?></div>
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
							<a class="label label-inverse" href="<?php echo get_category_link($cat->term_id); ?>"><?php echo $cat->name; ?></a>
						<?php
							}
						?>
					</div><!-- .post-categories -->
				</div><!-- .post-info -->
				<?php if($count % 2 == 0) { ?>
				<a class="post-image span5" href="<?php echo get_permalink($id); ?>">
					<img class="post-image-inner" src="<?php echo full_image_url($id); ?>">
				</a>
				<?php } ?>
			</div><!-- .post -->
			<?php endwhile; ?>
    </div><!-- #content -->
    
    <div id="nav-below">
      <div class="nav-previous"><?php next_posts_link( '&laquo; Older posts' ); ?></div>
      <div class="nav-next"><?php previous_posts_link( 'Newer posts &raquo;' ); ?></div>
    </div><!-- #nav-below -->
 
</div><!-- #container -->
 
<div id="primary" class="widget-area">
</div><!-- #primary .widget-area -->
 
<div id="secondary" class="widget-area">
</div><!-- #secondary -->
<?php get_footer(); ?>
