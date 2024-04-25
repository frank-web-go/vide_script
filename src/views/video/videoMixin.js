export const Mixin = {
    data() {
        return {
            
        };
    },
    methods: {
        handSelectChange(row) {
            this.ids = row.map(item => item.id)
        },
        ceshiMIX(ids) {
            console.log("王哈哈");
        },
    },
    mounted() {

    }
};
