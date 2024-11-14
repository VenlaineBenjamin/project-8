(function ($) {
    $.fn.mauGallery = function (options) {
        options = $.extend({}, $.fn.mauGallery.defaults, options);
        let tagsCollection = [];

        this.each(function () {
            const $gallery = $(this);
            $.fn.mauGallery.methods.createRowWrapper($gallery);

            if (options.lightBox) {
                $.fn.mauGallery.methods.createLightBox($gallery, options);
            }

            $gallery.children(".gallery-item").each(function () {
                const $item = $(this);
                $.fn.mauGallery.methods.responsiveImageItem($item);
                $.fn.mauGallery.methods.moveItemInRowWrapper($item);
                $.fn.mauGallery.methods.wrapItemInColumn(
                    $item,
                    options.columns
                );

                const theTag = $item.data("gallery-tag");
                if (
                    options.showTags &&
                    theTag &&
                    !tagsCollection.includes(theTag)
                ) {
                    tagsCollection.push(theTag);
                }
            });

            if (options.showTags) {
                $.fn.mauGallery.methods.showItemTags(
                    $gallery,
                    options.tagsPosition,
                    tagsCollection
                );
            }

            $gallery.fadeIn(500);
        });

        $.fn.mauGallery.listeners(options);

        return this;
    };

    $.fn.mauGallery.defaults = {
        columns: 3,
        lightBox: true,
        lightboxId: "galleryLightbox",
        showTags: true,
        tagsPosition: "bottom",
        navigation: true,
    };

    $.fn.mauGallery.listeners = function (options) {
        $(".gallery")
            .on("click", ".gallery-item", function () {
                if (options.lightBox && $(this).is("img")) {
                    $.fn.mauGallery.methods.openLightBox(
                        $(this),
                        options.lightboxId
                    );
                }
            })
            .on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag)
            .on("click", ".mg-prev", () =>
                $.fn.mauGallery.methods.prevImage(options.lightboxId)
            )
            .on("click", ".mg-next", () =>
                $.fn.mauGallery.methods.nextImage(options.lightboxId)
            );
    };

    $.fn.mauGallery.methods = {
        createRowWrapper($element) {
            if (!$element.children().first().hasClass("row")) {
                $element.append('<div class="gallery-items-row row"></div>');
            }
        },
        wrapItemInColumn($item, columns) {
            let columnClasses = "";

            if (typeof columns === "number") {
                columnClasses = `col-${Math.ceil(12 / columns)}`;
            } else if (typeof columns === "object") {
                if (columns.xs)
                    columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
                if (columns.sm)
                    columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
                if (columns.md)
                    columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
                if (columns.lg)
                    columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
                if (columns.xl)
                    columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
            } else {
                console.error(
                    `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
                );
            }

            $item.wrap(`<div class="item-column mb-4 ${columnClasses}"></div>`);
        },
        moveItemInRowWrapper($item) {
            $item.appendTo(".gallery-items-row");
        },
        responsiveImageItem($item) {
            if ($item.is("img")) {
                $item.addClass("img-fluid");
            }
        },
        openLightBox($item, lightboxId) {
            $(`#${lightboxId}`)
                .find(".lightboxImage")
                .attr("src", $item.attr("src"));
            $(`#${lightboxId}`).modal("toggle");
        },
        prevImage(lightboxId) {
            this.navigateImage(lightboxId, -1);
        },
        nextImage(lightboxId) {
            this.navigateImage(lightboxId, 1);
        },
        navigateImage(lightboxId, direction) {
            const $lightboxImage = $(`#${lightboxId} .lightboxImage`);
            const activeSrc = $lightboxImage.attr("src");
            const activeTag = $(".tags-bar .active-tag").data("images-toggle");
            const imagesCollection = [];

            $(".item-column img").each(function () {
                const $img = $(this);
                if (
                    activeTag === "all" ||
                    $img.data("gallery-tag") === activeTag
                ) {
                    imagesCollection.push($img);
                }
            });

            const index =
                imagesCollection.findIndex(
                    ($img) => $img.attr("src") === activeSrc
                ) + direction;
            const newImage =
                imagesCollection[
                    (index + imagesCollection.length) % imagesCollection.length
                ];
            $lightboxImage.attr("src", newImage.attr("src"));
        },
        createLightBox($gallery, { lightboxId, navigation }) {
            $gallery.append(`
        <div class="modal fade" id="${lightboxId}" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body">
                ${
                    navigation
                        ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                        : ""
                }
                <img class="lightboxImage img-fluid" alt="Image content displayed in modal on click"/>
                ${
                    navigation
                        ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                        : ""
                }
              </div>
            </div>
          </div>
        </div>
      `);
        },
        showItemTags($gallery, position, tags) {
            const tagItems = tags
                .map(
                    (tag) =>
                        `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`
                )
                .join("");
            const tagsRow = `<ul class="my-4 tags-bar nav nav-pills"><li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>${tagItems}</ul>`;

            if (position === "bottom") {
                $gallery.append(tagsRow);
            } else if (position === "top") {
                $gallery.prepend(tagsRow);
            } else {
                console.error(`Unknown tags position: ${position}`);
            }
        },
        filterByTag() {
            const $this = $(this);
            if ($this.hasClass("active-tag")) return;

            $(".active-tag").removeClass("active active-tag");
            $this.addClass("active-tag active");

            const tag = $this.data("images-toggle");

            $(".gallery-item").each(function () {
                const $item = $(this).parents(".item-column");
                if (tag === "all" || $(this).data("gallery-tag") === tag) {
                    $item.show(300);
                } else {
                    $item.hide();
                }
            });
        },
    };
})(jQuery);
