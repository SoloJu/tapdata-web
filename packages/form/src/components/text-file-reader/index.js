import { defineComponent, ref } from 'vue-demi'

export const TextFileReader = defineComponent({
  props: ['value', 'accept', 'maxFileSize', 'base64', 'fileName'],
  setup(props, { emit, root }) {
    const fileName = ref(props.fileName || '')
    let selectFile = file => {
      if (file) {
        fileName.value = file.name
        if (props.maxFileSize && file.size / 1024 > props.maxFileSize) {
          root.$message.error(`上传文件大小不能超过 ${props.maxFileSize}KB`)
        } else {
          let reader = new FileReader()
          if (props.base64) {
            let fileResult = ''
            reader.readAsDataURL(file)
            reader.onload = function () {
              fileResult = reader.result
            }
            reader.onloadend = function () {
              emit('change', fileResult.split(',')[1])
              emit('update:fileName', file.name)
            }
          } else {
            reader.readAsText(file)
            reader.onload = () => {
              emit('change', reader.result)
              emit('update:fileName', file.name)
            }
          }
        }
      } else {
        emit('change', '')
        emit('update:fileName', '')
      }
    }

    return () => {
      return (
        <ElInput
          value={fileName.value}
          placeholder={root.$t('formBuilder.file.placeholder')}
          vOn:clear={() => {
            emit('change', null)
            emit('update:fileName', null)
          }}
        >
          <template slot="append">
            <ElUpload
              props={{
                action: '',
                limit: 1,
                autoUpload: false,
                accept: props.accept,
                showFileList: false,
                onChange: file => {
                  selectFile(file.raw)
                },
                onExceed: fileList => {
                  selectFile(fileList[0])
                }
              }}
            >
              <ElButton>{root.$t('formBuilder.file.button')}</ElButton>
            </ElUpload>
          </template>
        </ElInput>
      )
    }
  }
})
