class Different_Page_Banner {

	static init(){
		this.PLUGIN_ID = "pixeldepth_custom_banner";

		this.banners = [];
		this.route = pb.data("route");

		this.patterns = {

			profile_summary: "user",
			profile_activity: "show_user_activity",
			profile_following: "show_user_following",
			profile_friends: "show_user_friends",
			profile_groups: "show_user_groups",
			profile_notifications: "show_user_notifications",
			profile_gifts: "show_user_gift",
			profile_edit: "edit_user_avatar",
			members: "members",
			search: "search",
			search_results: "search_results",
			calendar: /^calendar(_(day|month|list(_default)?))?$/,
			message_inbox: "conversations_inbox",
			message_outbox: "conversations_outbox",
			message_archive: "conversations",
			message_conversation: /^((new_)?conversation|new_message|quote_messages)$/,
			home: "home",
			forum_home: "forum",
			recent_threads: "recent_threads",
			recent_posts: "all_recent_posts",
			participated: "participated_threads",
			monetary_shop: "monetaryshop",
			monetary_bank: "bank",
			monetary_stockmarket: "stockmarket"

		};;

		this.setup();

		$(this.ready.bind(this));
	}

	static ready(){
		if(this.banners.length){
			let $banner = $("#banner");

			if($banner.length == 1){
				for(let a = 0, l = this.banners.length; a < l; ++ a){
					if(this.check_page(this.banners[a])){
						let css = {};

						css["background-image"] = "url(" + this.banners[a].banner_url + ")";

						if(this.banners[a].background_repeat && this.banners[a].background_repeat){
							css["background-repeat"] = this.banners[a].background_repeat;
						}

						if(this.banners[a].background_position && this.banners[a].background_position.length){
							css["background-position"] = this.banners[a].background_position;
						}

						if(this.banners[a].background_color && this.banners[a].background_color.length){
							css["background-color"] = "#" + this.banners[a].background_color;
						} else if(this.banners[a].background_transparent && this.banners[a].background_transparent == "1"){
							css["background-color"] = "transparent";
						}

						if(this.banners[a].banner_height && this.banners[a].banner_height.length){
							css["height"] = parseInt(this.banners[a].banner_height) + "px";
						}

						if(this.banners[a].hide_logo && this.banners[a].hide_logo == 1){
							$("#banner #logo").hide();
						}

						$banner.css(css);
					}
				}
			}
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			let settings = plugin.settings;

			if(settings.banners){
				this.banners = settings.banners;
			}
		}
	}

	// Need to check specific pages, and boards / categories

	static check_page(banner){

		// Check specific page version (i.e profile, messages...)
		// This overrules categories and boards
		// Current there is no conflict with cats and boards

		if(this.specific_page_match(banner.show_on_page)){
			return true;
		}

		if(this.board_match(banner.boards)){
			return true;
		}

		if(this.category_match(banner.categories)){
			return true;
		}

		if(this.custom_page_match(banner.custom_pages)){
			return true;
		}

		return false;
	}

	static board_match(boards){
		let page = proboards.data("page");

		if(page.board && page.board.id){
			if($.inArrayLoose(page.board.id, boards) > -1){
				return true;
			}
		}

		return false;
	}

	static category_match(categories){
		let page = proboards.data("page");

		if(page.category && page.category.id){
			if($.inArrayLoose(page.category.id, categories) > -1){
				return true;
			}
		}

		return false;
	}

	static custom_page_match(custom_pages){
		if(custom_pages && custom_pages.length){
			let ids = custom_pages.split(",");
			let page_id = (this.route && this.route.params && this.route.params.page_id)? this.route.params.page_id : "";

			if($.inArrayLoose(page_id, ids) > -1){
				return true;
			}
		}

		return false;
	}

	static specific_page_match(pages){
		if(pages && pages.length){
			for(let m = 0, l = pages.length; m < l; ++ m){
				if(this.patterns[pages[m]]){
					if(typeof this.patterns[pages[m]] === "string" && this.patterns[pages[m]].match("monetary")){
						if(location.href.match(new RegExp("\?" + this.patterns[pages[m]], "i"))){
							return true;
						}
					} else {
						let pattern = (typeof this.patterns[pages[m]] === "string")? this.patterns[pages[m]] : new RegExp(this.patterns[pages[m]], "i");

						if(this.route.name.match(pattern)){
							return true;
						}
					}
				}
			}
		}

		return false;
	}

}

Different_Page_Banner.init();