<?php get_header(); ?>
<div id="container">
 
    <div id="content">
			<?php $count = 0; ?>
			<?php while ( have_posts() ) :the_post(); ?>
			<?php $count++; ?>
			<div class="post row-fluid" >
				<?php if($count % 2 == 1) { ?><img class="post-image span5" src="<?php echo full_image_url($id); ?>"> <?php } ?>
				<div class="post-info span7">
					<div class="post-title"><a href="<?php echo get_permalink($id); ?>"><?php the_title(); ?></a></div>
					<div class="post-date"><?php the_date('l, F j, Y'); ?></div>
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
				</div><!-- .post-info -->
				<?php if($count % 2 == 0) { ?><img class="post-image span5" src="<?php echo full_image_url($id); ?>"> <?php } ?>
			</div><!-- .post -->
			<?php endwhile; ?>
    </div><!-- #content -->
 
</div><!-- #container -->
 
<div id="primary" class="widget-area">
</div><!-- #primary .widget-area -->
 
<div id="secondary" class="widget-area">
</div><!-- #secondary -->
<?php get_footer(); ?>
