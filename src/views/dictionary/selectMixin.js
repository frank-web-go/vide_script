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
                },
                data: [],
            },
        };
    },
    methods: {
        handSelectChange(row) {
            this.ids = row.map(item => item.id)
        },
        settime(time) {
            return time == 0 ? time : this.$moment.unix(time / 100).format('YYYY-MM-DD')
          },
    },
    mounted() {

    }
};
