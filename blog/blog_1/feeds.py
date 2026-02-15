import markdown

from django.contrib.syndication.views import Feed

from django.template.defaultfilters import truncatewords_html

from django.urls import reverse_lazy
from .models import Post


class LatestPostsFeed(Feed):
    title = "My blog"
    link = reverse_lazy("blog_1:post_lists")
    description = "New posts of my blog"

    def items(self):
        return Post.published.all()[:5]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return truncatewords_html(markdown.markdown(item.body), 30)

    def item_pubdate(self, item):
        return item.publish

    def item_link(self, item):
        """Use the post's get_absolute_url (uses blog_1:post_detail)."""
        return item.get_absolute_url()
