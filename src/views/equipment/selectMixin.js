export const Mixin = {
    data() {
        return {
            isloading: false,
            datetime: null,
            ids: [],
            table: {
                show: false,
                total: 0,
                pageSizes: [10, 50, 100],
                params: {
                    page: 1,
                    limit: 10,
                    area_name:"",
                    language_name:""
                },
                data: [],
            },
        };
    },
    methods: {
        handSelectChange(row) {
            this.ids = row.map(item => item.id)
        },
        addTags() {
            this.$refs.addvideos.modal.show = true
            this.$refs.addvideos.modal.title = "添加标签"
            this.$refs.addvideos.getTagDetail({})
          },
          updateMV(row) {
            this.$refs.addvideos.modal.show = true
            this.$refs.addvideos.modal.title = "修改标签"
            this.$refs.addvideos.getTagDetail(row)
        },
        settime(time) {
            return time == 0 ? time : this.$moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
          },
    },
    mounted() {

    }
};
