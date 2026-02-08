from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView

from .models import Post
from .forms import EmailPostForm, CommentForm
from django.core.mail import send_mail

from django.views.decorators.http import require_POST

# --- Class-based view (in use for post list) ---


class PostListView(ListView):
    """
    Post list view (class-based). Shows only published posts, paginated.
    """

    queryset = Post.published.all()
    context_object_name = "posts"
    paginate_by = 3
    template_name = "blog/post/post_list.html"


# --- Function-based view (same behaviour – for comparison while learning) ---
# from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
#
# def post_lists(request):
#     post_list = Post.published.all()
#     paginator = Paginator(post_list, 3)
#     page_number = request.GET.get('page', 1)
#     try:
#         posts = paginator.page(page_number)
#     except PageNotAnInteger:
#         posts = paginator.page(1)
#     except EmptyPage:
#         posts = paginator.page(paginator.num_pages)
#
#     return render(
#         request,
#         'blog/post/post_list.html',
#         {'posts': posts}
#     )
# To use it: in urls.py use path('', views.post_lists, name='post_list') instead of PostListView.
# In post_list.html use: {% include "blog/pagination.html" with page=posts %} (function view passes
# the Page as 'posts'; ListView passes the list as 'posts' and the Page as 'page_obj').


def post_detail(request, year, month, day, post):
    # try:
    #     post = Post.published.get(id=id)
    # except Post.DoesNotExist:
    #     raise Http404("Post does not exist")
    post = get_object_or_404(
        Post,
        status=Post.Status.PUBLISH,
        slug=post,
        publish__year=year,
        publish__month=month,
        publish__day=day,
    )

    return render(request, "blog/post/post_detail.html", {"post": post})


def post_share(request, post_id):

    # Retrieve post by id

    post = get_object_or_404(Post, id=post_id, status=Post.Status.PUBLISH)
    sent = False
    if request.method == "POST":
        # Form was submitted
        form = EmailPostForm(request.POST)
        if form.is_valid():
            # Form fields passed validation
            cd = form.cleaned_data
            post_url = request.build_absolute_uri(post.get_absolute_url())
            subject = f"{cd['name']} recommends you read " f"{post.title}"
            message = (
                f"Read {post.title} at {post_url}\n\n"
                f"{cd['name']}'s comments: {cd['comments']}"
            )
            send_mail(
                subject=subject,
                message=message,
                from_email=None,
                recipient_list=[cd["to"]],
            )
            sent = True

            # ... send email
    else:
        form = EmailPostForm()
    return render(
        request, "blog/post/post_share.html", {"post": post, "form": form, "sent": sent}
    )


@require_POST
def post_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id, status=Post.Status.PUBLISH)
    comment = None
    form = CommentForm(data=request.POST)
    if form.is_valid():
        comment = form.save(commit=False)
        comment.save()
    return render(
        request,
        "blog/post/post_comment.html",
        {"post": post, "form": form, "comment": comment},
    )
