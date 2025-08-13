// API Routes organized by feature
export const allRoutes = {
  auth: {
    register: '/register',
    login: '/login',
    forgotPassword: '/forgot-password',
    otpVerify: '/otp-verify',
    changePassword: '/change-password',
    refreshToken: '/refresh',
    logout: '/logout',
    teamLogin: '/team-login'
  },
  projects: {
    list: '/projects',
    create: '/projects',
    update: (id) => `/projects/${id}`,
    get: (id) => `/projects/${id}`,
    delete: (id) => `/projects/${id}`,
    stats: '/projects/stats',
    recentActivity: '/projects/recent-activity',
    getById: (id) => `/projects/dashboard/${id}`,
    addTeamMember: (id) => `/projects/${id}/team-members`
  },
  productOwner: {
    time_logs_list: '/time-logs',
    add_time_log: '/time-logs',
    dashboard: '/dashboard',
    get_assigned_projects: '/user-project/assigned-projects'
  },
  tasks: {
    list: '/tasks',
    create: '/tasks',
    update: (id) => `/tasks/${id}`,
    get: (id) => `/tasks/${id}`,
    delete: (id) => `/tasks/${id}`,
    assign: (id) => `/tasks/${id}/assign`,
    updateStatus: (id) => `/tasks/${id}/status`
  },
  sprints: {
    list: '/sprints',
    create: '/sprints',
    update: (id) => `/sprints/${id}`,
    get: (id) => `/sprints/${id}`,
    delete: (id) => `/sprints/${id}`,
    addTask: (id) => `/sprints/${id}/tasks`,
    removeTask: (sprintId, taskId) => `/sprints/${sprintId}/tasks/${taskId}`
  },
  stories: {
    list: '/stories',
    create: '/stories',
    update: (id) => `/stories/${id}`,
    get: (id) => `/stories/${id}`,
    delete: (id) => `/stories/${id}`,
    addTask: (id) => `/stories/${id}/tasks`
  },
  timesheets: {
    list: '/timesheets',
    create: '/timesheets',
    update: (id) => `/timesheets/${id}`,
    get: (id) => `/timesheets/${id}`,
    delete: (id) => `/timesheets/${id}`,
    submit: (id) => `/timesheets/${id}/submit`,
    approve: (id) => `/timesheets/${id}/approve`,
    reject: (id) => `/timesheets/${id}/reject`
  },
  users: {
    list: '/users',
    create: '/users',
    update: (id) => `/users/${id}`,
    get: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password'
  },
  teams: {
    list: '/teams',
    create: '/teams',
    update: (id) => `/teams/${id}`,
    get: (id) => `/teams/${id}`,
    delete: (id) => `/teams/${id}`,
    members: (id) => `/teams/${id}/members`,
    addMember: (id) => `/teams/${id}/members`,
    removeMember: (teamId, memberId) => `/teams/${teamId}/members/${memberId}`,
    password: (id) => `/teams/${id}/password`,
    base: '/teams'
  },
  clients: {
    list: '/clients',
    create: '/clients',
    update: (id) => `/clients/${id}`,
    get: (id) => `/clients/${id}`,
    delete: (id) => `/clients/${id}`,
    projects: (id) => `/clients/${id}/projects`
  },
  dashboard: {
    stats: '/dashboard/stats',
    recentActivity: '/dashboard/recent-activity',
    adminStats: '/dashboard/admin/stats',
    userStats: '/dashboard/user/stats'
  },
  reports: {
    projects: '/reports/projects',
    tasks: '/reports/tasks',
    timesheets: '/reports/timesheets',
    users: '/reports/users',
    performance: '/reports/performance'
  },
  settings: {
    general: '/settings/general',
    notifications: '/settings/notifications',
    security: '/settings/security',
    integrations: '/settings/integrations'
  },
  notifications: {
    list: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    delete: (id) => `/notifications/${id}`
  },
  files: {
    upload: '/files/upload',
    download: (id) => `/files/${id}/download`,
    delete: (id) => `/files/${id}`,
    list: '/files'
  },
  skills: {
    list: '/skills',
    create: '/skills',
    update: (id) => `/skills/${id}`,
    delete: (id) => `/skills/${id}`,
    get: (id) => `/skills/${id}`
  }
}; 