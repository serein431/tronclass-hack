import { window, Hack, Delay, PostAjax } from '@cuclh/userscript-base';
import _ from 'lodash';

_.assign(Hack, {
	header: '畅课 Hack',

	async Init() {
		const requiredKeys = [
			'st', 'globalData', 'videojs', 'elasticApm'
		].filter(key => !(key in window));

		if(requiredKeys.length != 0)
			throw new Error(`必须字段载入失败：${requiredKeys.join(',')}`);

		// Session info

		this.statistics = window.st;
		const course = this.course = window.globalData.course;
		this.dept = window.globalData.dept;
		this.user = window.globalData.user

		// Activity state

		const activities = this.activities = await (async () => {
			const json = await PostAjax(`/api/courses/${course.id}/activities`, 'GET');
			try {
				const obj = JSON.parse(json);
				return obj['activities'] || null;
			} catch(err) {
				console.error(err);
				return null;
			}
		})();

		this.videos = activities.filter(activity => activity?.uploads?.some(
			upload => upload?.videos?.some(
				video => 'duration' in video
			)
		));

		// Video player

		this.player = window.videojs.players[Object.keys(window.videojs.players)[0]];
		this.$player = this.player.tech_.el();

		this.player.__proto__.pause = () => { };
		this.player.playbackRate(10);
		this.$player.addEventListener('loadeddata', async function() {
			await Delay(100);
			this.currentTime = this.duration;
		});

		// Transaction

		this.transaction = window.elasticApm.serviceFactory.instances.TransactionService;
		this.transaction.__proto__.startTransaction = function(t, e, n) {
			var transaction, options = this.createOptions(n), needStart = true;
			if(options.managed) {
				transaction = this.startManagedTransaction(t, e, options);
				if(this.currentTransaction === transaction)
					needStart = false;
			} else
				transaction = new Pe(t, e, options);
			transaction.onEnd = () => this.handleTransactionEnd(transaction);
			transaction.outcome = true;	// Force finish
			console.log(transaction, options, needStart);
			if(needStart)
				this._config.events.send('transaction:start', [transaction]);
			return transaction;
		};
	},
	async PostVideoActivityProgress(activity, progress) {
		const upload = activity.uploads?.[0];
		const video = upload?.videos?.[0];
		if(!video)
			return null;
		if(isNaN(progress))
			progress = video.duration;	// Need to be confirmed
		const payload = {
			action_type: 'play',
			activity_id: this.statistics.tags.activity_id,
			// activity_type: activity.type,
			// auto_interval: true,
			// browser: 'firefox',
			comment_id: null,
			course_code: this.course.courseCode,
			course_id: this.course.id,
			course_name: this.course.name,
			dept_code: this.dept.code,
			dept_id: this.dept.id,
			dept_name: this.dept.name,
			is_teacher: false,
			master_course_id: 0,
			meeting_type: 'online_video',
			module_id: this.statistics.tags.module_id,
			org_code: this.user.orgCode,
			org_id: this.user.orgId,
			org_name: this.user.orgName,
			reply_id: null,
			user_agent: navigator.userAgent,
			user_id: this.user.id,
			user_name: this.user.name,
			user_no: this.user.userNo,
			ts: null,	// Don't know
			upload_id: upload.id,	// Don;t know
			// visit_duration: progress,
			//
			dutation: progress,
			start_at: 0,
			end_at: progress,
		};
		return await PostAjax(
			'/statistics/api/online-videos',
			'POST',
			{
				'Content-Type': 'text/plain;charset=utf-8'
			},
			JSON.stringify(payload)
		);
	}
});

Hack.Run();
