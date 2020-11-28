export default {
    data() {
        return {
            // 基本信息
            activeName: "first",
            baseInfo: {
                brand: "",
                brandOptions: [
                    {
                        label: "点付",
                        value: "df"
                    },
                    {
                        label: "开刷",
                        value: "ks"
                    },
                    {
                        label: "趣付传统",
                        value: "qfct"
                    },
                    {
                        label: "趣付电签",
                        value: "qfdq"
                    },
                ],
                merchantName: "",
                area: "",
                areaOptions: [
                    {
                        label: "北京",
                        value: "bj"
                    }
                ],
                machineAddress: "",
                legalPersonName: "",
                legalPersonNumber: "",
                legalIdDate1: "",
                legalIdDate2: "",
                legalTelNumber: "",
                subOrdinate: "",
                subOrdinateOptions: [
                    {
                        label: "本级或下级代理名称",
                        value: "1"
                    }
                ],
                debitCardRate: "",
                capValue: "",
                creditCardRate: "",
                d0Rate: "",
                littleRate: "",
                nfcRate: "",
                payRate: ""
            },
            aptitudeInfo: {
                idCardFront: ""
            },

            // 资质信息
            imageUrl: '',

            //结算信息
            billInfo:{
                accountType:"",
                openName:"",
                openArea:"",
                openAreaOptions:[
                    {
                        label:"北京",
                        value:"bj"
                    }
                ],
                openId:""
            }
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        goBack() {
            this.$router.push({ name: "merchant-query" })
        },

        // 资质信息
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
};