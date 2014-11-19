(function(){

    define(
        {
            activityContainer: null,
            outroContainer: null,
            bar_1: null,
            bar_2: null,
            icon_1: null,
            icon_2: null,
            min_width: 0,
            max_width: 0,
            toggleIntro: false,
            initActivity: false,
            intro_bar_asset: "assets/sliding_rats/intro_slide_min.png",
            activity_bar_asset: "assets/sliding_rats/activity_slide_min.png",
            outro_bar_asset: "assets/sliding_rats/outro_slide_min.png",
            left_arrow_asset: "assets/sliding_rats/left_arrow.png",
            right_arrow_asset: "assets/sliding_rats/right_arrow.png",

            init: function( _activity, _outro, _bar_1, _bar_2, _icon_1, _icon_2, _min_width, _max_width) {
                this.activityContainer = _activity;
                this.outroContainer = _outro;
                this.bar_1 = _bar_1;
                this.bar_2 = _bar_2;
                this.icon_1 = _icon_1;
                this.icon_2 = _icon_2;
                this.min_width = _min_width;
                this.max_width = _max_width;

                bar_1.onclick = this.bar1ClickHandler.bind(this);
                bar_2.onclick = this.bar2ClickHandler.bind(this);
            },

            bar1ClickHandler: function(e) {
                if( this.toggleIntro === false ) {
                    this.activityContainer.style.width = this.max_width + 'px';
                    this.outroContainer.style.width = this.min_width + 'px';
                    this.bar_1.src = this.intro_bar_asset;
                    this.icon_1.src = this.right_arrow_asset;
                    if( this.initActivity === false ) {
                        g_initActivity();
                        this.initActivity = true;
                    }
                    this.toggleIntro = true;
                } else {
                    this.activityContainer.style.width = this.min_width + 'px';
                    this.outroContainer.style.width = this.min_width + 'px';
                    this.bar_1.src = this.activity_bar_asset;
                    this.icon_1.src = this.left_arrow_asset;

                    this.toggleIntro = false;
                }
                this.icon_2.src = this.left_arrow_asset;
            },

            bar2ClickHandler: function(e) {
                this.outroContainer.style.width = this.max_width + 'px';
                this.activityContainer.style.width = this.min_width + 'px';
                this.bar_1.src = this.activity_bar_asset;
                this.icon_1.src = this.right_arrow_asset;
                this.icon_2.src = this.right_arrow_asset;

                this.toggleIntro = false;
            }
        }
    );

}());