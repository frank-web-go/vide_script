import config from "../api/config";
import { Message } from "element-ui";

/*富文本编辑图片上传配置*/
const uploadConfig = {
  name: "file",
  size: 3,
  accpet: "image/png, image/gif, image/jpeg, image/jpg, image/svg+xml",
};

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 有序、无序列表
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ direction: "rtl" }], // 文本方向
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }],
  [{ font: [] }], // 字体颜色、字体背景颜色
  [{ align: [] }], // 对齐方式
  ["clean"], // 清除文本格式
  ["image"], // 图片
];

const handlers = {
  image: function image() {
    let self = this;
    let fileInput = this.container.querySelector("input.ql-image[type=file]");
    if (fileInput === null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute("name", uploadConfig.name);
      }
      // 可设置上传图片的格式
      fileInput.setAttribute("accept", uploadConfig.accept);
      fileInput.classList.add("ql-image");
      // 监听选择文件
      fileInput.addEventListener("change", function (e) {
        let imgFile = fileInput.files[0];
        console.log("imgFile: ", imgFile);
        const isPFX =
          imgFile.type === "image/png" ||
          imgFile.type === "image/jpg" ||
          imgFile.type === "image/jpeg" ||
          imgFile.type === "image/gif" ||
          imgFile.type === "image/svg";
        const isLt3M = imgFile.size / 1024 / 1024 < 3;
        if (!isPFX) {
          Message.warning("只能上传PNG,JPG,SVG,GIF图片");
          return;
        }
        if (!isLt3M) {
          Message.warning("上传图片不能大于3M");
          return;
        }
        let reader = new FileReader();
        console.log('reader: ', reader);
        reader.readAsDataURL(imgFile);
        reader.onload = () => {
            console.log('fileInput: ', fileInput);
        // fileInput.value = reader.result
        console.log('reader.result: ', reader.result);
           let length = self.quill.getSelection(true).index;
            self.quill.insertEmbed(length, 'image', reader.result);
            self.quill.setSelection(length + 1)
        }
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  },
};

export default {
  placeholder: "请输入",
  theme: "snow", // 主题
  modules: {
    toolbar: {
      container: toolOptions, // 工具栏选项
      handlers: handlers, // 事件重写
    },
  },
};
