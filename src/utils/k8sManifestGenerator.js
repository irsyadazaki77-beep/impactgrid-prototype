/**
 * Generates official production-grade Kubernetes (K8s) deployment manifest 
 * tailored for Telkomsel Hybrid Cloud (Telkom Cloud Sentul & Surabaya + GCP Jakarta).
 */
export function generateTelkomselK8sManifest() {
  return `apiVersion: v1
kind: Namespace
metadata:
  name: impactgrid-telecom
  labels:
    tier: production
    managed-by: telkomsel-it-ops
    compliance: iso27001-uupdp
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: impactgrid-config
  namespace: impactgrid-telecom
data:
  CLUSTER_REGION: "id-jamali"
  DATA_CENTER_PRIMARY: "telkom-dc-sentul"
  DATA_CENTER_DR: "telkom-dc-surabaya"
  TMF_API_GATEWAY_URL: "https://api.telkomsel.co.id/tmf-api"
  ORAN_O1_VES_COLLECTOR: "ves-collector.internal.telkomsel.co.id:8080"
  ORAN_A1_RIC_URL: "https://nonrt-ric.tsel-ran.internal:8443/a1-p/policies"
  DATA_SOVEREIGNTY_JURISDICTION: "ID-PP71-2019"
  BGP_ROUTER_ASN: "17974"
  CRYPTO_AUDIT_ALGORITHM: "SHA-256"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: impactgrid-orchestrator
  namespace: impactgrid-telecom
  labels:
    app: impactgrid-orchestrator
    role: core-engine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: impactgrid-orchestrator
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: impactgrid-orchestrator
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values: ["impactgrid-orchestrator"]
                topologyKey: "topology.kubernetes.io/zone"
      containers:
        - name: orchestrator-core
          image: registry.telkomsel.co.id/impactgrid/core-engine:v2.4.0
          imagePullPolicy: IfNotPresent
          resources:
            requests:
              cpu: "1000m"
              memory: "2Gi"
            limits:
              cpu: "4000m"
              memory: "8Gi"
          ports:
            - containerPort: 8080
              name: http
            - containerPort: 9090
              name: metrics
          envFrom:
            - configMapRef:
                name: impactgrid-config
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
          securityContext:
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            runAsUser: 10001
            allowPrivilegeEscalation: false
            capabilities:
              drop: ["ALL"]
---
apiVersion: v1
kind: Service
metadata:
  name: impactgrid-orchestrator-svc
  namespace: impactgrid-telecom
  labels:
    app: impactgrid-orchestrator
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 8080
      name: http
    - port: 9090
      targetPort: 9090
      name: prometheus
  selector:
    app: impactgrid-orchestrator
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: impactgrid-orchestrator-hpa
  namespace: impactgrid-telecom
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: impactgrid-orchestrator
  minReplicas: 3
  maxReplicas: 12
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: impactgrid-network-policy
  namespace: impactgrid-telecom
spec:
  podSelector:
    matchLabels:
      app: impactgrid-orchestrator
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: database-tier
      ports:
        - protocol: TCP
          port: 5432 # TimescaleDB
        - protocol: TCP
          port: 9092 # Apache Kafka
`;
}
