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
    dashboard: '/dashboard',
    list: '/projects',
    create: '/projects',
    update: (id) => `/projects/${id}`,
    get: (id) => `/projects/${id}`,
    delete: (id) => `/projects/${id}`,
    stats: '/projects/stats',
    recentActivity: '/projects/recent-activity',
    getById: (id) => `/projects/dashboard/${id}`,
    addTeamMember: '/user-project/assign-user',
    getAssignedUsers: (id) => `/user-project/assigned-users?project_id=${id}`,
    getTeamMembersDropdown: (id) => `/teams/dropdown?project_id=${id}`,
    removeTeamMember: (id, userId) => `/user-project/remove-user?project_id=${id}&user_id=${userId}`,
    get_assigned_projects: '/user-project/assigned-projects'
  },
  productOwner: {
    time_logs_list: '/time-logs',
    add_time_log: '/time-logs',
    dashboard: '/dashboard',  
    get_assigned_projects: '/user-project/assigned-projects'
  },
  mindmap: {
    store: '/mindmaps',
    get:(projectId) => `mindmaps?project_id=${projectId}`,
    delete: (nodeId, projectId) => `/mindmaps/${nodeId}?project_id=${projectId}`
  },
  comments: {
    store: '/comments',
    get: (projectId, type, storyId) => {
      let url = `comments?project_id=${projectId}&type=${type}`
      if(type === 'user_story'){
        url += `&user_story_id=${storyId}`
      }
      if(type === 'test_case'){
        url += `&test_case_id=${storyId}`
      }
      return url
    },
    getByStoryId: (storyId, projectId) => `comments?story_id=${storyId}&project_id=${projectId}`
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
    dashboard: (projectId) => `/sprints/dashboard?project_id=${projectId}`,
    list: '/sprints',
    create: '/sprints',
    updateStatus: (id, status) => `/sprints/${id}/${status}`,
    update: (id) => `/sprints/${id}`,
    get: (id) => `/sprints?project_id=${id}`,
    delete: (id) => `/sprints/${id}`,
    addTask: (id) => `/sprints/${id}/tasks`,
    removeTask: (sprintId, taskId) => `/sprints/${sprintId}/tasks/${taskId}`,
    getSprintById: (id, projectId) => `/sprints/${id}?project_id=${projectId}`,
    getSprintBacklog: (id) => `/sprints/${id}/backlog`,
    uploadImage: (fileName, file) => `/sprints/upload-image?fileName=${fileName}&file=${file}`,
    createBug: '/bugs'
  },
  stories: {
    list: (projectId, sprintId, motive) =>{
      let url = `/user-stories?project_id=${projectId}&per_page=1000`
      if(motive){
        url += `&motive=${motive}`
        if(sprintId){
          url += `&sprint_id=${sprintId}`
        }
      }
      return url
    },
    drag_drop_story: (id) => `/sprints/${id}/user-stories/drag-drop`,
    create: '/user-stories',
    update: (id) => `/user-stories/${id}`,
    get: (id, projectId) => `/user-stories/${id}?project_id=${projectId}`,
    delete: (id, projectId) => `/user-stories/${id}?project_id=${projectId}`,
    addTask: (id) => `/user-stories/${id}/tasks`,
    markAsReady: (id) => `/user-stories/${id}/mark-ready`,
    updateStoryPoints: (id) => `/user-stories/${id}/update-story-points`,
    markReadyForEstimate: (id, projectId) => `/user-stories/${id}/ready-for-estimate?project_id=${projectId}`
  },
  testCases: {
    list: (projectId, storyId) => `/test-cases?project_id=${projectId}&user_story_id=${storyId}`,
    create: '/test-cases',
    update: (id) => `/test-cases/${id}`,
    pass_test_case: (id) => `/test-cases/${id}/pass`,
    fail_test_case: (id) => `/test-cases/${id}/fail`,
    approve_test_case: (id) => `/test-cases/${id}/approve`,
    reject_test_case: (id) => `/test-cases/${id}/reject`
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