export default {
  props: {
    url: String,
    father: [String, Number],
    model: String,
    value: {
      default() {
        if (this.multiple === true) {
          return []
        }
        return ''
      }
    },
    labelvalue: String,
    type: [String, Number],
    excludeCode: String,
    selectid: [String, Number],
    selectname: [String, Number],
    clearable: Boolean,
    filterable: Boolean,
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    collapsetags: {

      type: Boolean,
      default() {
        return false
      }
    }
  },
  mounted() {
    // log('I have already mounted')
  },
  methods: {
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleInput(event) {
      this.$emit('input', event)
    },
    handleChange(event, data) {
      this.$emit('change', event, data)
    }
  }
}
