<?php get_header(); ?>
<div id="container">
 
    <div id="content">
			<ul class="posts">
				<?php while ( have_posts() ) : the_post() ?>
				<li class="post row-fluid" >
					<?php echo full_image($id); ?>
					<?php //echo thumb_image($id); ?>
					<div class="post-info span8">
						<!--<div class="visible-phone phone-padding"></div>
						<div class="visible-tablet tablet-padding"></div>
						<div class="visible-desktop desktop-padding"></div>-->
						<div class="post-title"><a href="<?php echo get_permalink($id); ?>"><?php the_title(); ?></a></div>
						<div class="post-date"><?php the_date('l, F j, Y'); ?></div>
						<div class="post-categories">
							<?php
								$categories = wp_get_post_categories($id);
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
						</div>
						<span class="visible-desktop"><a href="<?php echo get_permalink( $id ) ?>" class="btn btn-large btn-inverse">View Gallery</a></span>
						<span class="visible-tablet"><a href="<?php echo get_permalink( $id ) ?>" class="btn btn-small btn-inverse">View Gallery</a></span>
						<span class="visible-phone"><a href="<?php echo get_permalink( $id ) ?>" class="btn btn-mini btn-inverse">View Gallery</a></span>
					</div>
				</li>
				<?php endwhile; ?>
			</ul>
    </div><!-- #content -->
 
</div><!-- #container -->
 
<div id="primary" class="widget-area">
</div><!-- #primary .widget-area -->
 
<div id="secondary" class="widget-area">
</div><!-- #secondary -->
<?php get_footer(); ?>
