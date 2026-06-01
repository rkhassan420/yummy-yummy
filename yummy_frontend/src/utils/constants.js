export const API_URL      = import.meta.env.VITE_API_URL   || 'http://localhost:8000/api'
export const MEDIA_URL    = import.meta.env.VITE_MEDIA_URL  || 'http://localhost:8000/media'
export const DELIVERY_FEE = Number(import.meta.env.VITE_DELIVERY_FEE) || 200

export const ORDER_STATUSES = {
  pending:    { label: 'Pending',     color: 'badge-yellow' },
  preparing:  { label: 'Preparing',   color: 'badge-navy'   },
  on_the_way: { label: 'On the Way',  color: 'badge-navy'   },
  delivered:  { label: 'Delivered',   color: 'badge-green'  },
  cancelled:  { label: 'Cancelled',   color: 'badge-red'    },
}

export const SORT_OPTIONS = [
  { value: 'default',    label: 'Default'           },
  { value: 'price',      label: 'Price: Low → High' },
  { value: '-price',     label: 'Price: High → Low' },
  { value: 'name',       label: 'Name: A → Z'       },
]
