{{- define "common-api.fullname" -}}
{{ .Release.Name }}
{{- end }}

{{- define "common-api.labels" -}}
app.kubernetes.io/name: {{ .Release.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}