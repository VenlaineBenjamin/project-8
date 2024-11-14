!(function (a) {
    (a.fn.mauGallery = function (e) {
        e = a.extend({}, a.fn.mauGallery.defaults, e);
        let t = [];
        return (
            this.each(function () {
                const l = a(this);
                a.fn.mauGallery.methods.createRowWrapper(l),
                    e.lightBox && a.fn.mauGallery.methods.createLightBox(l, e),
                    l.children(".gallery-item").each(function () {
                        const l = a(this);
                        a.fn.mauGallery.methods.responsiveImageItem(l),
                            a.fn.mauGallery.methods.moveItemInRowWrapper(l),
                            a.fn.mauGallery.methods.wrapItemInColumn(
                                l,
                                e.columns
                            );
                        const s = l.data("gallery-tag");
                        e.showTags && s && !t.includes(s) && t.push(s);
                    }),
                    e.showTags &&
                        a.fn.mauGallery.methods.showItemTags(
                            l,
                            e.tagsPosition,
                            t
                        ),
                    l.fadeIn(500);
            }),
            a.fn.mauGallery.listeners(e),
            this
        );
    }),
        (a.fn.mauGallery.defaults = {
            columns: 3,
            lightBox: !0,
            lightboxId: "galleryLightbox",
            showTags: !0,
            tagsPosition: "bottom",
            navigation: !0,
        }),
        (a.fn.mauGallery.listeners = function (e) {
            a(".gallery")
                .on("click", ".gallery-item", function () {
                    e.lightBox &&
                        a(this).is("img") &&
                        a.fn.mauGallery.methods.openLightBox(
                            a(this),
                            e.lightboxId
                        );
                })
                .on("click", ".nav-link", a.fn.mauGallery.methods.filterByTag)
                .on("click", ".mg-prev", () =>
                    a.fn.mauGallery.methods.prevImage(e.lightboxId)
                )
                .on("click", ".mg-next", () =>
                    a.fn.mauGallery.methods.nextImage(e.lightboxId)
                );
        }),
        (a.fn.mauGallery.methods = {
            createRowWrapper(a) {
                a.children().first().hasClass("row") ||
                    a.append('<div class="gallery-items-row row"></div>');
            },
            wrapItemInColumn(a, e) {
                let t = "";
                "number" == typeof e
                    ? (t = `col-${Math.ceil(12 / e)}`)
                    : "object" == typeof e
                    ? (e.xs && (t += ` col-${Math.ceil(12 / e.xs)}`),
                      e.sm && (t += ` col-sm-${Math.ceil(12 / e.sm)}`),
                      e.md && (t += ` col-md-${Math.ceil(12 / e.md)}`),
                      e.lg && (t += ` col-lg-${Math.ceil(12 / e.lg)}`),
                      e.xl && (t += ` col-xl-${Math.ceil(12 / e.xl)}`))
                    : console.error(
                          `Columns should be defined as numbers or objects. ${typeof e} is not supported.`
                      ),
                    a.wrap(`<div class="item-column mb-4 ${t}"></div>`);
            },
            moveItemInRowWrapper(a) {
                a.appendTo(".gallery-items-row");
            },
            responsiveImageItem(a) {
                a.is("img") && a.addClass("img-fluid");
            },
            openLightBox(e, t) {
                a(`#${t}`).find(".lightboxImage").attr("src", e.attr("src")),
                    a(`#${t}`).modal("toggle");
            },
            prevImage(a) {
                this.navigateImage(a, -1);
            },
            nextImage(a) {
                this.navigateImage(a, 1);
            },
            navigateImage(e, t) {
                const l = a(`#${e} .lightboxImage`),
                    s = l.attr("src"),
                    i = a(".tags-bar .active-tag").data("images-toggle"),
                    o = [];
                a(".item-column img").each(function () {
                    const e = a(this);
                    ("all" !== i && e.data("gallery-tag") !== i) || o.push(e);
                });
                const n = o.findIndex((a) => a.attr("src") === s) + t,
                    m = o[(n + o.length) % o.length];
                l.attr("src", m.attr("src"));
            },
            createLightBox(a, { lightboxId: e, navigation: t }) {
                a.append(
                    `\n        <div class="modal fade" id="${e}" tabindex="-1" role="dialog" aria-hidden="true">\n          <div class="modal-dialog" role="document">\n            <div class="modal-content">\n              <div class="modal-body">\n                ${
                        t
                            ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                            : ""
                    }\n                <img class="lightboxImage img-fluid" alt="Image content displayed in modal on click"/>\n                ${
                        t
                            ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                            : ""
                    }\n              </div>\n            </div>\n          </div>\n        </div>\n      `
                );
            },
            showItemTags(a, e, t) {
                const l = `<ul class="my-4 tags-bar nav nav-pills"><li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>${t
                    .map(
                        (a) =>
                            `<li class="nav-item"><span class="nav-link" data-images-toggle="${a}">${a}</span></li>`
                    )
                    .join("")}</ul>`;
                "bottom" === e
                    ? a.append(l)
                    : "top" === e
                    ? a.prepend(l)
                    : console.error(`Unknown tags position: ${e}`);
            },
            filterByTag() {
                const e = a(this);
                if (e.hasClass("active-tag")) return;
                a(".active-tag").removeClass("active active-tag"),
                    e.addClass("active-tag active");
                const t = e.data("images-toggle");
                a(".gallery-item").each(function () {
                    const e = a(this).parents(".item-column");
                    "all" === t || a(this).data("gallery-tag") === t
                        ? e.show(300)
                        : e.hide();
                });
            },
        });
})(jQuery);
