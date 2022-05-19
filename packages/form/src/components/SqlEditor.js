import { VCodeEditor } from '@tap/component'

export const SqlEditor = {
  props: {
    value: String,
    height: {
      type: [String, Number],
      default: 200
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      sql: this.value
    }
  },

  watch: {
    value(v) {
      this.sql = v
    }
  },

  methods: {
    onInput(v) {
      this.sql = v
      this.$emit('input', v)
      this.$emit('change', v)
    }
  },

  render() {
    const options = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      ...this.options
    }
    return (
      <VCodeEditor
        class="border rounded-2"
        value={this.sql}
        lang="sql"
        theme="sqlserver"
        height={this.height}
        onInput={this.onInput}
        options={options}
      />
    )
  }
}

export default SqlEditor
